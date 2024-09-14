export const commonCss = {
    ".ivu-btn-primary": {
        backgroundColor: "#8c0776",
        color: "#ffffff",
        borderColor: "#8c0776",
        margin: "5px"

    },
    ".ivu-btn-primary:hover": {
        color: "#fff",
        backgroundColor: "#a33991",
        borderColor: "#a33991",
    },
    ".ivu-btn:not([disabled]):hover": {
        textDecoration: "none"
    },
    ".ivu-btn-primary:hover, .ivu-btn-primary:active, .ivu-btn-primary.active": {
        color: " #fff"
    },
    ".ivu-tabs-nav .ivu-tabs-tab-active": {
        color: "#8c0776"
    },
    ".ivu-tabs-ink-bar": {
        height: "2px",
        boxSizing: "border-box",
        backgroundColor: "#8c0776",
        position: "absolute",
        left: "0",
        bottom: "1px",
        zIndex: "1",
        transition: "transform .3s ease-in-out",
        transformOrigin: "0 0",
    }
}
export const gaoqu = {
    display: 'inline-block',
    userSelect: 'none',
    width: '16px',
    marginRight: '6px',
    transform: 'scale(1.5)',
    '-webkit-user-drag': 'none'
};

export const hoverPrimary = {
    cursor: "pointer",
    "&:hover": {
        color: "#8c0776",
        "text-decoration": "underline"
    }
}

export const trigger = {
    cursor: 'pointer',
    boxShadow: '1px 1px 5px black',
    borderRadius: '50%',
    backgroundColor: 'white',
    width: '50px',
    height: '50px',
    zIndex: '0',
    userDrag: 'none',
}

export const flexContainer = {
    display: 'flex',
    flexDirection: 'column',
    '& .item': {
        display: 'flex',
        lineHeight: '28px',
        flexDirection: 'row',
        '& .label': {
            minWidth: '100px'
        },
        '& .value': {
            flex: 1,
            wordBreak: 'break-all',
        }
    }
}
export const buttonContainer = {
    padding: '5px'
}
export const error = {
    color: '#ed4014',
}
export const success = {
    color: '#19be6b'
}
export const info = {
    color: '#2db7f5'
}
export const globalDrawerCollapse = {
    '.ivu-drawer-header': {
        height: '51px',
        display: 'flex',
        alignItems: 'center'
    },
    '.ivu-drawer-body': {
        padding: 0,
        display: 'flex',
        flexDirection: 'column'
    },
    '.ivu-collapse': {
        flex: 1,
        overflowX: 'auto'
    }
}