import React, { useState } from 'react';
import { Button, Divider, Drawer, Radio, Space } from 'antd';

const DrawerBN = (props) => {

    const {
        openView, setOpenView, dataView, setDataView
    } = props

    const onClose = () => {
        setOpenView(false)
        setDataView(null)
    };

  return (
    <Drawer
        title={`Xem chi tiết lịch đã khám của bệnh nhân ${dataView?.patientName}`}
        placement={'left'}
        closable={false}
        onClose={onClose}
        open={openView}
        width={500}
        // key={placement}
      >
        <ul>
        {dataView?.patientDetails?.map(item => {
            return (
                <>
                    <li key={item.ngayKhamBenh + item.tenGioKham} style={{lineHeight: "30px"}}>
                        <strong>Ngày khám:</strong> {item.ngayKhamBenh} <br/>
                        <strong>Giờ khám:</strong> {item.tenGioKham} <br/>
                        <strong>Lí do khám:</strong> {item.lidokham || ''}    <br/>                            
                        <strong>Bệnh án:</strong> &nbsp;
                        <span style={{ whiteSpace: "pre-wrap", maxWidth: "500px" }}>
                            <div className="truncate"  dangerouslySetInnerHTML={{ __html: item.benhAn || 'Chưa có bệnh án' }} />
                            {/* {item.benhAn || 'Chưa có bệnh án'} */}
                        </span>
                    </li>
                    <Divider/>
                </>
                )
            })}
        </ul>    
    </Drawer>
  )
}
export default DrawerBN