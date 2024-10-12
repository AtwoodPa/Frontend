package com.tingkl.mcn.dto.audit.assignpay;

import com.tingkl.mcn.model.audit.AuditAssignPayLog;
import lombok.Data;

import java.util.List;

/**
 * 项目执行订单撤销提审记录 分页查询dto
 * @author Karl
 * @since 2024-10-11 12:34:41
 */
@Data
public class SearchAssignPayResult {
    private List<AuditAssignPayLog> auditAssignPayLogList;
}
