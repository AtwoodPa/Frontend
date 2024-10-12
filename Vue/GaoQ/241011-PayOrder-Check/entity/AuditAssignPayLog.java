package com.tingkl.mcn.model.audit;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author Karl
 * @since 2024-10-11 12:34:41
 */
@Data
public class AuditAssignPayLog implements Serializable {
    private static final long serialVersionUID = 304762750881926151L;

    private Integer id;
    /**
     * project主键
     */
    private Integer projectId;
    /**
     * assign表主键
     */
    private Integer assignId;
    /**
     * pay_new表主键
     */
    private Integer payNewId;
    /**
     * assign表中的 payId：GQ075983241010210123183700
     */
    private String payNewCode;
    /**
     * 审核状态
     */
    private Integer status;
    /**
     * 提交人ID
     */
    private Integer submitterId;
    /**
     * 审核人ID
     */
    private Integer reviewerId;
    /**
     * 提交时间
     */
    private Date submitTime;
    /**
     * 操作时间
     */
    private Date actionTime;
    /**
     * 提交的截图URL
     */
    private String submitUrl;
    /**
     * 审核备注
     */
    private String remark;

}
