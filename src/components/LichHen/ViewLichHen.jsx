import { UserOutlined } from "@ant-design/icons"
import { Avatar, Badge, Button, Card, Collapse, Descriptions, Drawer } from "antd"
import moment from 'moment-timezone';
const { Meta } = Card;
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FaFileExport } from "react-icons/fa";

const ViewLichHen = (props) => {

    const {
        openViewDH, dataViewDH, setOpenViewDH, setDataViewDH
    } = props

    const cancel = () => {
        setOpenViewDH(false)
        setDataViewDH(null)
    }

    const items = [
        {
          key: 'image',
          label: 'Hình ảnh',
          children:  <Avatar src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${dataViewDH?._idTaiKhoan?.image}`} shape="square" size={100} icon={<UserOutlined />} /> ,
        },
        {
          key: 'hoten',
          label: 'Họ và tên bệnh nhân',
          children: <span>{dataViewDH?.patientName} <br/> ({moment(dataViewDH?.dateBenhNhan).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY')})</span>,
          span: 3,
        },     
        {
            key: 'phone',
            label: 'Số điện thoại',
            children: dataViewDH?.phone,
            span: 1,
          },  
        {
          key: 'address',
          label: 'Địa chỉ',
          children: dataViewDH?.address,
          span: 2,
        },        
          {
            key: 'ngayKham',
            label: 'Ngày khám',
            children: dataViewDH?.ngayKhamBenh,
            span: 1,
          },
          {
              key: 'priceKham',
              label: 'Chi phí khám bệnh',
              children: <span style={{color: "red"}}>{Math.ceil(dataViewDH?.giaKham).toLocaleString()} VNĐ</span>,
              span: 2,
            },        
        {
          key: '6',
          label: 'Lí do đi khám',
          children: <Badge status="processing" text={`${dataViewDH?.lidokham}`} />,
          span: 3,
        },
        {
            key: 'doctor',
            label: 'Bác sĩ khám',
            children: <span>{dataViewDH?._idDoctor?.lastName} {dataViewDH?._idDoctor?.firstName}</span>,
            span: 1.5,
        },
        {
            key: 'timeKham',
            label: 'Thời gian khám',
            children: dataViewDH?.tenGioKham,
            span: 1.5,
        },   
        {
            key: 'diachipk',
            label: 'Địa chỉ phòng khám',
            // children: <Badge status="processing" text={`${dataViewDH?._idDoctor?.phongKhamId?.address}`} />,
            children: <div>
                <Card
                    hoverable
                    style={{ width: 300, textAlign: "center", margin: "auto" }}
                    cover={<img width={300} height={300} alt="example" src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${dataViewDH?._idDoctor?.phongKhamId?.image}`} />}
                >
                    <Meta title={` Phòng khám: ${dataViewDH?._idDoctor?.phongKhamId?.name}`} description={`${dataViewDH?._idDoctor?.phongKhamId?.address}`} />
                </Card>
            {/* <Collapse
                style={{marginTop: "30px"}}
                size="large"
                items={[
                    {
                    key: 'description',
                    label: 'Xem mô tả chi tiết phòng khám',
                    children: <div className="truncate"  dangerouslySetInnerHTML={{ __html: dataViewDH?._idDoctor?.phongKhamId?.description }} />,
                    },
                ]}
            /> */}
            </div>,
            span: 3,
          },  
       
    ];

    const exportToPDF = () => {
        const drawerContent = document.getElementById("drawer-content");
      
        if (!drawerContent) {
          console.error("Drawer content not found!");
          return;
        }
      
        html2canvas(drawerContent, {
            useCORS: true, 
            allowTaint: true, 
        }).then((canvas) => {
            // Tạo pdf với kích thước trang A4
            const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' là portrait (dọc), 'mm' là đơn vị đo, 'a4' là loại giấy

            const imgData = canvas.toDataURL("image/png");

            // Tính toán kích thước ảnh sao cho vừa với trang PDF (có thể thay đổi)
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Thêm ảnh vào PDF, cách 20px từ trên cùng (Y = 20px)
            const marginTop = 20; // Khoảng cách từ trên cùng

            // Thêm ảnh vào PDF (điều chỉnh toạ độ và kích thước ảnh cho phù hợp)
            pdf.addImage(imgData, "PNG", 0, marginTop, pdfWidth, canvas.height * pdfWidth / canvas.width);

            pdf.save(`LichHen-${dataViewDH?.patientName}.pdf`);
        }).catch((error) => {
            console.error("Error while capturing the content:", error);
        });
    };

    return (
        <Drawer
            closable
            destroyOnClose
            title={<p >CHI TIẾT LỊCH HẸN CỦA BỆNH NHÂN: <span style={{color: "navy", fontWeight: "bold"}}>{dataViewDH?.patientName}</span></p>}
            placement="left"
            open={openViewDH}
            onClose={cancel}
            width={850}
            // height={600}
        >
             <div style={{textAlign: "center"}}>
                <Button icon={<FaFileExport />} onClick={exportToPDF} size="large">Export PDF</Button>
            </div>
            <br/>
            <div id="drawer-content"> 
                <Descriptions bordered items={items} />
            </div>
        </Drawer>
    )
}
export default ViewLichHen