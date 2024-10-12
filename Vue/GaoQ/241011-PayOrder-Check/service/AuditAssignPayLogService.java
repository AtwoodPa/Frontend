package com.tingkl.mcn.service;

import com.tingkl.framework.dto.Page;
import com.tingkl.framework.em.Code;
import com.tingkl.framework.exception.CodeException;
import com.tingkl.framework.service.PageService;
import com.tingkl.mcn.Enums;
import com.tingkl.mcn.dto.audit.assignpay.SearchAssignPayResult;
import com.tingkl.mcn.dto.audit.assignpay.SearchAuditAssignPayLog;
import com.tingkl.mcn.mapper.AssignMapper;
import com.tingkl.mcn.mapper.AuditAssignPayLogMapper;
import com.tingkl.mcn.mapper.PayNewMapper;
import com.tingkl.mcn.model.audit.AuditAssignPayLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditAssignPayLogService extends PageService {
    @Autowired
    @Lazy
    ShiroService shiroService;
    
    @Resource
    private AuditAssignPayLogMapper auditAssignPayLogMapper;

    @Resource
    private AssignMapper assignMapper;

    @Resource
    private PayNewMapper payNewMapper;


    /**
     * 分页查询
     * @return 查询结果
     */
    public SearchAssignPayResult queryByPage(SearchAuditAssignPayLog searchLogDto) {
        SearchAssignPayResult searchAssignPayResult = new SearchAssignPayResult();
        Page page = searchLogDto.getPage();
        startPage(page);
        List<AuditAssignPayLog> auditAssignPayLogList =  auditAssignPayLogMapper.search(searchLogDto);
        setPage(auditAssignPayLogList, page);
        searchAssignPayResult.setAuditAssignPayLogList(auditAssignPayLogList);
        return searchAssignPayResult;
    }

    /**
     * 提交审核
     */
    public AuditAssignPayLog save(AuditAssignPayLog auditAssignPayLog) {
        log.info("AuditAssignPayLogService==> save --> auditAssignPayLog:{}",auditAssignPayLog);
        if (auditAssignPayLog.getAssignId() == null || auditAssignPayLog.getPayNewCode() == null) {
            throw new CodeException(Code.Illegal, "缺少必填项：assignId 或 getPayNewCode");
        }
        auditAssignPayLog.setStatus(Enums.AuditAssignPayCHeckStatusValue.待审核);
        auditAssignPayLog.setSubmitterId(shiroService.getMember().getId());// 设置提审人id
        auditAssignPayLog.setSubmitTime(new Date());
        auditAssignPayLog.setReviewerId(-1);
        auditAssignPayLog.setActionTime(new Date());
        // 防止重复提交审核记录
        AuditAssignPayLog existingLog = auditAssignPayLogMapper.queryByAssignAndPayNew(
                auditAssignPayLog.getAssignId(),
                auditAssignPayLog.getPayNewCode()
        );
        if (existingLog != null && existingLog.getStatus() == Enums.AuditAssignPayCHeckStatusValue.待审核) {
            throw new CodeException(Code.Illegal, "该任务已经提交审核，正在等待审核结果");
        }
        int saveCount = auditAssignPayLogMapper.save(auditAssignPayLog);
        if (saveCount <= 0) {
            throw new CodeException(Code.Illegal, "审核记录保存失败");
        }
        return auditAssignPayLog;
    }

    /**
     * 操作审核
     *
     */
    public AuditAssignPayLog update(AuditAssignPayLog auditAssignPayLog) {
        log.info("AuditAssignPayLogService==> update--> auditAssignPayLog:{}",auditAssignPayLog);
        AuditAssignPayLog currentLog = auditAssignPayLogMapper.queryById(auditAssignPayLog.getId());
        if (currentLog == null) {
            throw new CodeException(Code.Illegal, "审核记录不存在");
        }
        if (currentLog.getStatus() == Enums.AuditAssignPayCHeckStatusValue.审核通过 ||
                currentLog.getStatus() == Enums.AuditAssignPayCHeckStatusValue.审核拒绝) {
            throw new CodeException(Code.Illegal, "当前记录已经被审核，无法再次操作");
        }
        int newStatus = auditAssignPayLog.getStatus();
        if (newStatus != Enums.AuditAssignPayCHeckStatusValue.待审核 &&
                newStatus != Enums.AuditAssignPayCHeckStatusValue.审核通过 &&
                newStatus != Enums.AuditAssignPayCHeckStatusValue.审核拒绝 &&
                newStatus != Enums.AuditAssignPayCHeckStatusValue.审核取消) {
            throw new CodeException(Code.Illegal, "非法的审核状态: " + newStatus);
        }
        auditAssignPayLog.setActionTime(new Date());
        auditAssignPayLog.setReviewerId(shiroService.getMember().getId());
        int updateCount = auditAssignPayLogMapper.update(auditAssignPayLog);
        if (newStatus == Enums.AuditAssignPayCHeckStatusValue.审核通过){
            // 审核通过，做订单撤回逻辑
            // 清空 assign 表的 payId
            assignMapper.updatePayId(auditAssignPayLog.getAssignId());
            // 将 pay_new 表的 assignId 设置为 -assignId (取反)
            payNewMapper.updatePayId(auditAssignPayLog.getAssignId());
        }
        if (updateCount <= 0) {
            throw new CodeException(Code.Illegal, "审核记录更新失败");
        }

        return auditAssignPayLogMapper.queryById(auditAssignPayLog.getId());
    }
}