import { Col, Divider, Row, Space, Table, Tag, Tooltip } from "antd";
import moment from 'moment-timezone';
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Input } from 'antd';
import SearchComponent from "../Search/SearchComponent";
import { fetchCauHoi } from "../../services/apiDoctor";
const { Search } = Input;
import { MdQuickreply } from "react-icons/md";
import ModalReoly from "./ModalReoly";

const CauHoi = () => {
   
    const [dataOrder, setDataOrder] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [sortQuery, setSortQuery] = useState("sort=createdAt");
    const user = useSelector(state => state.accountDoctor.user._id)
    const [searchValue, setSearchValue] = useState(''); // State lưu giá trị tìm kiếm

    const [openReply, setOpenReply] = useState(false)
    const [dataCauHoiRep, setDataCauHoiRep] = useState(null)

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
        let res = await fetchCauHoi(query)
        console.log("res benhnhancuatoi: ", res);
        if(res && res.data) {
            setDataOrder(res.data)
            setTotal(res.totalQuestions)
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
                    <span>Email: {record?.email}</span> <br/>
                    <span>Họ và tên: {record?.lastName} {record?.firstName}</span> 
                </div>
            ),
            // width: 100
        },
        {
            title: "Câu hỏi",
            dataIndex: "cauhoii",
            key: "cauhoii",
            render: (text, record) => (
                <span style={{ fontWeight: "500", color: "green" }}>
                    {record?.cauHoi}
                </span>
            ),
            width: 190
        },
        {
            title: "Câu trả lời",
            dataIndex: "ttt",
            key: "ttt",
            render: (text, record) => (
                <>
                {record?.status ? <>
                    <span style={{ fontWeight: "500", color: "navy" }}>{record?.cauTraLoi}</span>
                </> : <>
                    <Tag color="red">Chưa trả lời</Tag>
                </>}
                </>
            ),
            width: 190
        },
        {
            title: "Trạng thái",
            dataIndex: "tt",
            key: "tt",
            render: (text, record) => (
                <>
                {record?.status ? <>
                    <Tag color="green">Đã trả lời</Tag>
                </> : <>
                    <Tag color="red">Chưa trả lời</Tag>
                </>}
                </>
            ),
            sorter: (a, b) => {
                // So sánh trạng thái true/false để sắp xếp
                return a.status === b.status ? 0 : a.status ? -1 : 1;
            },
            width: 50
        }, 
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => {
                return (
                    <>
                    {moment(record.createdAt)
                        .tz("Asia/Ho_Chi_Minh")
                        .format("DD-MM-YYYY")}{" "}
                    <span style={{ display: 'block' }}>
                        {moment(record.createdAt)
                        .tz("Asia/Ho_Chi_Minh")
                        .format("HH:mm:ss")}
                    </span>
                    </>
                );
            },
            sorter: true,
        },                             
        {
            title: "Chức năng",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip
                        title="Trả lời câu hỏi"
                        color={"green"}
                        key={"green"}
                    >
                        <MdQuickreply
                            size={23}
                            style={{
                                color: "green",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "18px",
                            }}
                            onClick={() => {
                                console.log("record: ", record);
                                setOpenReply(true);
                                setDataCauHoiRep(record);
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

    console.log("data cau hoi: ", dataOrder);
    

  return (
    <Row gutter={[20,10]}>
        <Col xs={24} sm={12} md={24} span={24}>
            <SearchComponent
                onSearch={(value) => {
                    setSearchValue(value);  // Cập nhật giá trị tìm kiếm
                    findAllOrder(value);    // Gọi hàm tìm kiếm khi có thay đổi
                }}
                placeholder="Tìm câu hỏi"
                />         
        </Col>
        <Col xs={24} sm={12} md={24} span={24}>
        <Table 
            onChange={onChange}
            pagination={{
                current: current,
                pageSize: pageSize,
                showSizeChanger: true,
                total: total,
                showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} câu hỏi</div>) }
            }}
            // pagination={false}  // Tắt phân trang mặc định của Table
            loading={loadingOrder} 
            columns={columns} 
            dataSource={dataOrder}
             /> 
        </Col>    

        <ModalReoly
        openReply={openReply}
        setOpenReply={setOpenReply}
        dataCauHoiRep={dataCauHoiRep}
        setDataCauHoiRep={setDataCauHoiRep}
        findAllOrder={findAllOrder}
        />         
    </Row>
  )
}
export default CauHoi