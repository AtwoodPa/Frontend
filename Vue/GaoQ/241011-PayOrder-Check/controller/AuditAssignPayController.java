package com.tingkl.mcn.controller;

import com.tingkl.framework.dto.Result;
import com.tingkl.framework.util.ResultUtil;
import com.tingkl.mcn.dto.audit.assignpay.SearchAuditAssignPayLog;
import com.tingkl.mcn.model.audit.AuditAssignPayLog;
import com.tingkl.mcn.service.AuditAssignPayLogService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.annotation.RequiresUser;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;

@Api(tags = "氚云订单作废审核")
@Slf4j
@RestController
@RequestMapping("audit/auditAssignPayLog")
@RequiredArgsConstructor
public class AuditAssignPayController {
    @Resource
    private AuditAssignPayLogService auditAssignPayLogService;

    @ApiOperation(value = "提交审核")
    @PostMapping("/save")
    public Result submit(@RequestBody AuditAssignPayLog auditAssignPayLog){
        return ResultUtil.success(auditAssignPayLogService.save(auditAssignPayLog));
    }

    @ApiOperation(value = "操作审核")
    @PostMapping("/judge")
    public Result judge(@RequestBody AuditAssignPayLog auditAssignPayLog){
        return ResultUtil.success(auditAssignPayLogService.update(auditAssignPayLog));
    }

    @ApiOperation(value = "分页查询")
    @PostMapping("/search")
    @RequiresUser
    public Result search(@ApiParam @Valid @RequestBody SearchAuditAssignPayLog searchAuditAssignPayLog) {
        return ResultUtil.success(auditAssignPayLogService.queryByPage(searchAuditAssignPayLog), searchAuditAssignPayLog.getPage());
    }
}
