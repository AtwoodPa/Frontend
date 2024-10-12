package com.tingkl.mcn.dto.audit.assignpay;

import com.tingkl.framework.dto.Page;
import lombok.Data;

import java.util.List;

@Data
public class SearchAuditAssignPayLog {
    private Integer id;
    /**
     * 审核状态
     */
    private List<Integer> statusList;
    /**
     * 项目ID
     */
    private Integer projectId;
    /**
     * 项目名称
     */
    private String projectName;
    /**
     * 提交人ID
     */
    private Integer submitterId;

    Page page;
}
