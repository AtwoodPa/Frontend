package com.tingkl.mcn.mapper;

import com.tingkl.mcn.dto.audit.assignpay.SearchAuditAssignPayLog;
import com.tingkl.mcn.model.audit.AuditAssignPayLog;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 项目执行订单撤销审核日志表(AuditAssignPayLog)表数据库访问层
 *
 * @author makejava
 * @since 2024-10-11 12:34:41
 */
public interface AuditAssignPayLogMapper {

    /**
     * 新增数据
     *
     * @param auditAssignPayLog 实例对象
     * @return 影响行数
     */
    int save(AuditAssignPayLog auditAssignPayLog);


    /**
     * 修改数据
     *
     * @param auditAssignPayLog 实例对象
     * @return 影响行数
     */
    int update(AuditAssignPayLog auditAssignPayLog);

    /**
     * 通过主键查询数据
     *
     * @param id 主键
     * @return 影响行数
     */
    AuditAssignPayLog queryById(Integer id);

    /**
     * 分页查询
     */
    List<AuditAssignPayLog> search(SearchAuditAssignPayLog searchLogDto);

    /**
     * 防止重复提审
     * @param assignId
     * @param payNewCode
     * @return
     */
    AuditAssignPayLog queryByAssignAndPayNew(@Param("assignId") Integer assignId, @Param("payNewCode") String payNewCode);
}
