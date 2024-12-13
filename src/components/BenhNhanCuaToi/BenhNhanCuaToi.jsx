import { Col, Divider, Row, Space, Table, Tooltip } from "antd";
import moment from 'moment-timezone';
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { findAllLichHenByDoctor } from "../../services/doctorAPI";
import DrawerBN from "./Drawer";
import { Input } from 'antd';
import SearchComponent from "../Search/SearchComponent";
const { Search } = Input;

const BenhNhanCuaToi = () => {

    const [openView, setOpenView] = useState(false)
    const [dataView, setDataView] = useState(null)
    const [dataOrder, setDataOrder] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [sortQuery, setSortQuery] = useState("sort=createdAt");
    const user = useSelector(state => state.accountDoctor.user._id)
    const [searchValue, setSearchValue] = useState(''); // State lưu giá trị tìm kiếm

    const findAllOrder = async () => {
        setLoadingOrder(true)
        let query = `page=${current}&limit=${pageSize}`
        if (sortQuery) {
            query += `&${sortQuery}`;
        } 
        // Thêm tham số tìm kiếm vào query nếu có
        if (user) {
            query += `&idDoctor=${encodeURIComponent(user)}`;
        } 
        if (searchValue) {
            query += `&search=${encodeURIComponent(searchValue)}`;  // Thêm giá trị tìm kiếm vào query
        }
        let res = await findAllLichHenByDoctor(query)
        console.log("res benhnhancuatoi: ", res);
        if(res && res.data) {
            setDataOrder(res.data?.patientStatistics)
            // setTotal(res.data?.totalPatientss)
        }
        setLoadingOrder(false)
    }

    useEffect(() => {
        findAllOrder()
    },[user, current, pageSize, sortQuery, searchValue])

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            render: (text, record, index) => (
                <span>{index + 1 + (current - 1) * pageSize}</span>
            ),
            width: 50,
        },
        {
            title: "Bệnh nhân",
            dataIndex: "benhnhan",
            key: "benhnhan",
            render: (text, record) => (
                <div>                    
                    <span style={{ fontWeight: "bold" }}>{record?.patientName}</span> <br/>
                    <span>Email: {record?.email}</span> <br/>
                    <span>Số điện thoại: {record?.phone}</span> <br/>
                    <span>Địa chỉ: {record?.address}</span> 
                </div>
            ),
            // width: 100
        },
        {
            title: "Số lần đã khám",
            dataIndex: "solan",
            key: "solan",
            render: (text, record) => (
                <span style={{ fontWeight: "bold" }}>
                    {record?.totalBooked} lần
                </span>
            ),
            width: 50
        },
        // {
        //     title: <span style={{textAlign: "center"}}>Chi tiết đã khám</span>,
        //     dataIndex: "ttLich",
        //     key: "ttLich",            
        //     render: (text, record) => {
        //         return (
        //             <>
        //             <ul>
        //             {record?.patientDetails?.map(item => {
        //                 return (
        //                     <>
        //                         <li key={item.ngayKhamBenh + item.tenGioKham}>
        //                             <strong>Ngày khám:</strong> {item.ngayKhamBenh} <br/>
        //                             <strong>Giờ khám:</strong> {item.tenGioKham} <br/>
        //                             <strong>Lí do khám:</strong> {item.lidokham || ''}    <br/>                            
        //                             <strong>Bệnh án:</strong> &nbsp;
        //                             <span style={{ whiteSpace: "pre-wrap", maxWidth: "500px" }}>
        //                                 {item.benhAn || 'Chưa có bệnh án'}
        //                             </span>
        //                         </li>
        //                         <Divider/>
        //                     </>
        //                     )
        //                 })}
        //             </ul>                    
        //             </>
        //         );
        //     },
        //     width: "500px"
        //     // sorter: true,
        // },                        
        {
            title: "Chức năng",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip
                        title="Xem chi tiết lịch hẹn này"
                        color={"green"}
                        key={"green"}
                    >
                        <FaEye
                            size={23}
                            style={{
                                color: "green",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "18px",
                            }}
                            onClick={() => {
                                console.log("record: ", record);
                                setOpenView(true);
                                setDataView(record);
                            }}
                        />
                    </Tooltip>                  
                </Space>
            ),
        },
    ]; 

    const onChange = (pagination, filters, sorter, extra) => {
        console.log(">> check: pagination", pagination);
    
        // nếu thay dổi trang: current
        if(pagination && pagination.current){
          if( +pagination.current !== +current){
            setCurrent( +pagination.current) // ví dụ "5" -> 5
          }
        }
    
        // nếu thay đổi tổng số phần tử
        if(pagination && pagination.current){
          if( +pagination.pageSize !== +pageSize){
            setPageSize( +pagination.pageSize) // ví dụ "5" -> 5
          }
        }

        if (sorter && sorter.field) {
            const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'; // Determine sort order
            const newSortQuery = `sort=${sorter.field}&order=${sortOrder}`;
            if (newSortQuery !== sortQuery) {
                setSortQuery(newSortQuery); // Only update if sort query changes
            }
        }
    
        window.scrollTo({ top: 80, behavior: "smooth" });
    }   

  return (
    <Row gutter={[20,10]}>
        <Col xs={24} sm={12} md={24} span={24}>
            <SearchComponent
                onSearch={(value) => {
                    setSearchValue(value);  // Cập nhật giá trị tìm kiếm
                    findAllOrder(value);    // Gọi hàm tìm kiếm khi có thay đổi
                }}
                placeholder="Tìm bệnh nhân theo tên hoặc email hoặc số điện thoại"
                />         
        </Col>
        <Col xs={24} sm={12} md={24} span={24}>
        <Table 
            onChange={onChange}
            // pagination={{
            //     current: current,
            //     pageSize: pageSize,
            //     showSizeChanger: true,
            //     total: total,
            //     showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} lịch hẹn</div>) }
            // }}
            pagination={false}  // Tắt phân trang mặc định của Table
            loading={loadingOrder} 
            columns={columns} 
            dataSource={dataOrder}
             /> 
        </Col>   

        <DrawerBN
        openView={openView}
        setOpenView={setOpenView}
        dataView={dataView}
        setDataView={setDataView}
        />           
    </Row>
  )
}
export default BenhNhanCuaToi