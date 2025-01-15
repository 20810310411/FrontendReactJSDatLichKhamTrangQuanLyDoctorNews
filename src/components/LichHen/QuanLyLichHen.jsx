import { Col, Divider, Form, Input, message, Modal, notification, Row, Select, Space, Switch, Table, Tag, Tooltip } from "antd"
import { useEffect, useRef, useState } from "react"
import moment from 'moment-timezone';
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { findAllLichHenByDoctor } from "../../services/doctorAPI";
import ViewLichHen from "./ViewLichHen";
import React from "react";
import { RiEdit2Fill } from "react-icons/ri";
import { deleteLichHenn, updateTTBN, xacNhanLich } from "../../services/apiDoctor";
import './custom.css'
import SearchComponent from "../Search/SearchComponent";
import ModalEdit from "./ModalEdit";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { IoMdCloseCircle } from "react-icons/io";

const QuanLyLichHen = () => {

    const [dataOrder, setDataOrder] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [loadingEditKhamxONG, setLoadingEditKhamxONG] = useState(false);
    const [loadingXacNhanOrder, setLoadingXacNhanOrder] = useState(false);
    const [sortQuery, setSortQuery] = useState("sort=createdAt&order=desc");
    const editorRef = useRef(null);

    const [openViewDH, setOpenViewDH] = useState(false)
    const [dataViewDH, setDataViewDH] = useState(null)
    const user = useSelector(state => state.accountDoctor.user._id)
    const [searchValue, setSearchValue] = useState(''); // State lưu giá trị tìm kiếm

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataBenhNhan, setDataBenhNhan] = useState(null);
    const [checkKham, setCheckKham] = useState(false);
    const [selectedLoaiSP, setSelectedLoaiSP] = useState([]);
    const [selectedChoXacNhan, setSelectedChoXacNhan] = useState([]);
    console.log("dataBenhNhan: ", dataBenhNhan);

    const [form] = Form.useForm()

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
        if (selectedLoaiSP !== undefined && selectedLoaiSP !== null) {
            query += `&locTheoLoai=${encodeURIComponent(selectedLoaiSP)}`;
        }
        let res = await findAllLichHenByDoctor(query)
        console.log("res his order: ", res);
        if (res && res.data) {
            setDataOrder(res.data?.findOrder)
            setTotal(res.data?.totalOrder)
        }
        setLoadingOrder(false)
    }

    useEffect(() => {
        if (selectedLoaiSP !== undefined && selectedLoaiSP !== null) {
            findAllOrder();
        } else if (selectedLoaiSP === 'tatca') {
            findAllOrder();
        } else {
            findAllOrder();
        }
    }, [selectedLoaiSP]);

    useEffect(() => {
        findAllOrder()
    }, [user, current, pageSize, sortQuery, searchValue])

    const onChange = (pagination, filters, sorter, extra) => {
        console.log(">> check: pagination", pagination);
        console.log(">> sorter", sorter);

        // nếu thay dổi trang: current
        if (pagination && pagination.current) {
            if (+pagination.current !== +current) {
                setCurrent(+pagination.current) // ví dụ "5" -> 5
            }
        }

        // nếu thay đổi tổng số phần tử
        if (pagination && pagination.current) {
            if (+pagination.pageSize !== +pageSize) {
                setPageSize(+pagination.pageSize) // ví dụ "5" -> 5
            }
        }

        if (sorter && sorter.field) {
            const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'; // Determine sort order
            const newSortQuery = `sort=${sorter.field}&order=${sortOrder}`;
            if (newSortQuery !== sortQuery) {
                setSortQuery(newSortQuery); // Only update if sort query changes
            }
        } else if (!sorter) {
            // Nếu không có sắp xếp cụ thể, mặc định sắp xếp theo thứ tự giảm dần (desc)
            setSortQuery("sort=createdAt&order=desc");
        }

        window.scrollTo({ top: 80, behavior: "smooth" });
    }

    const deleteLichHen = async (id) => {

        const res = await deleteLichHenn(id)
        if (res && res.data) {
            message.success('hủy lịch thành công')
            await findAllOrder()
        }
    }

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
                <span style={{ fontWeight: "bold" }}>
                    {record?.patientName} <br /> <span style={{ fontWeight: "500" }}> SĐT:</span> &nbsp;
                    <span style={{ fontWeight: "500" }}>{record?.phone}</span>
                </span>
            ),
            // width: 100
        },
        {
            title: "Lịch hẹn",
            dataIndex: "ngayKhamBenh",
            key: "ngayKhamBenh",
            render: (text, record) => {
                return (
                    <>
                        {(record.ngayKhamBenh)} {'  '} <br /> {(record.tenGioKham)}

                    </>
                );
            },
            sorter: true,
        },
        // {
        //     title: (
        //         <span style={{ justifyContent: "center", display: "flex" }}>
        //             Trạng thái
        //         </span>
        //     ),
        //     key: "status",
        //     dataIndex: "status",
        //     render: (text, record) => {
        //         const getStatusTagForTinhTrangDonHang = (status) => {
        //             if (status === "Không Hủy") {
        //                 return {
        //                     color: "green",
        //                     icon: <CheckCircleOutlined />,
        //                 }; // khong huy
        //             }
        //             return {
        //                 color: "red",
        //                 icon: <ExclamationCircleOutlined />,
        //             }; // da huy
        //         };

        //         const getStatusTagForTinhTrangThanhToan = (status) => {
        //             return status === "Chưa đặt lịch"
        //                 ? { color: "red", icon: <ExclamationCircleOutlined /> }
        //                 : { color: "green", icon: <CheckCircleOutlined /> }; // "Đã Thanh Toán"
        //         };
        //         const getStatusTagForTrangThaiXacNhan = (status) => {
        //             return status === "Chờ xác nhận"
        //                 ? { color: "orange", icon: <ExclamationCircleOutlined /> }
        //                 : { color: "green", icon: <CheckCircleOutlined /> }; // "Đã xác nhận"
        //         };

        //         const donHangTag = getStatusTagForTinhTrangDonHang(
        //             record.trangThaiHuyDon
        //         );
        //         const thanhToanTag = getStatusTagForTinhTrangThanhToan(
        //             record.trangThai
        //         );
        //         const trangThaiXacNhan = getStatusTagForTrangThaiXacNhan(
        //             record.trangThaiXacNhan
        //         );
        //         return (
        //             <div style={{ display: "flex", justifyContent: "center" }}>
        //                 {record.trangThaiHuyDon === "Không Hủy" ? (
        //                     <>
        //                         <Tag
        //                             color={thanhToanTag.color}
        //                             icon={thanhToanTag.icon}
        //                         >
        //                             {/* {record.trangThai} */}
        //                             Không Hủy
        //                         </Tag>

        //                         {/* <Tag
        //                             color={trangThaiXacNhan.color}
        //                             icon={trangThaiXacNhan.icon}
        //                         >
        //                             {record.trangThaiXacNhan}
        //                         </Tag> */}
        //                     </>
        //                 ) : (
        //                     <Tag
        //                         color={donHangTag.color}
        //                         icon={donHangTag.icon}
        //                     >
        //                         {record.trangThaiHuyDon}
        //                     </Tag>
        //                 )}
        //             </div>
        //         );
        //     },
        // },
        {
            title: (
                <span style={{ justifyContent: "center", display: "flex" }}>
                    Trạng thái
                </span>
            ),
            key: "status",
            dataIndex: "status",
            render: (text, record) => {
                const getStatusTag = () => {
                    // Kiểm tra nếu trangThaiHuyDon là "Đã Hủy"
                    if (record.trangThaiHuyDon === 'Đã Hủy') {
                        return {
                            color: "red",
                            icon: <ExclamationCircleOutlined />,
                            label: "Đã Hủy",
                        };
                    }

                    // Khi trangThaiXacNhan === false và trangThaiKham === false: Chờ xác nhận
                    if (!record.trangThaiXacNhan && !record.trangThaiKham) {
                        return {
                            color: "orange",
                            icon: <ExclamationCircleOutlined />,
                            label: "Chờ xác nhận",
                        };
                    }
                    // Khi trangThaiXacNhan === true và trangThaiKham === false: Không hủy
                    if (record.trangThaiXacNhan && !record.trangThaiKham) {
                        return {
                            color: "blue",
                            icon: <CheckCircleOutlined />,
                            label: "Chờ khám",
                        };
                    }
                    // Khi trangThaiKham === true: Đã khám
                    if (record.trangThaiKham) {
                        return {
                            color: "green",
                            icon: <CheckCircleOutlined />,
                            label: "Đã khám",
                        };
                    }
                    // Mặc định trả về trạng thái "Chờ khám"
                    return {
                        color: "blue",
                        icon: <CheckCircleOutlined />,
                        label: "Chờ khám",
                    };
                };

                const getStatusTagThanhToan = () => {
                    if (record.trangThaiThanhToan) {
                        return {
                            color: "green",
                            icon: <CheckCircleOutlined />,
                            label: "Đã thanh toán",
                        };
                    }
                    // Mặc định trả về trạng thái "Chờ khám"
                    return {
                        color: "red",
                        icon: <ExclamationCircleOutlined />,
                        label: "Chưa thanh toán",
                    };
                };
                const statusTag = getStatusTag();  // Lấy thông tin trạng thái dựa trên các điều kiện
                const statusTagThanhToan = getStatusTagThanhToan();  // Lấy thông tin trạng thái dựa trên các điều kiện

                return (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Tag color={statusTag.color} icon={statusTag.icon}>
                            {statusTag.label}
                        </Tag>
                        <Tag color={statusTagThanhToan.color} icon={statusTagThanhToan.icon}>
                            {statusTagThanhToan.label}
                        </Tag>
                    </div>
                );
            },
        },


        {
            title: (
                <span style={{ justifyContent: "center", display: "flex" }}>
                    Bệnh Án
                </span>
            ),
            key: "status",
            dataIndex: "status",
            width: 200,
            render: (text, record) => {
                return (
                    <>
                        {record?.trangThaiKham === true ? (<>
                            <div
                                style={{
                                    textAlign: "center",
                                    wordWrap: "break-word",
                                    wordBreak: "break-all",
                                    whiteSpace: "nowrap",      // Ngăn chặn xuống dòng
                                    overflow: "hidden",        // Ẩn phần vượt ra ngoài
                                    textOverflow: "ellipsis",  // Hiển thị dấu ba chấm
                                    maxWidth: "200px",         // Đặt chiều rộng tối đa
                                    display: "inline-block",   // Đảm bảo nội dung không bị tràn
                                    maxHeight: "50px"
                                }}
                                dangerouslySetInnerHTML={{ __html: record?.benhAn }}
                            >
                            </div>
                        </>) : (<>
                            <p style={{ color: "red", textAlign: "center" }}>chưa khám bệnh</p>
                        </>)}
                    </>
                );
            },
        },
        // {
        //     title: "Thông tin",
        //     dataIndex: "total",
        //     key: "total",
        //     render: (text, record) => {
        //         return (
        //             <>
        //                 <span>Đã đặt lịch: {record.tenGioKham} </span> <br />
        //                 <span>Ngày: {record.ngayKhamBenh} </span> <br />
        //                 <span>
        //                     Tổng{" "}
        //                     <span style={{ color: "red" }}>
        //                         {Math.ceil(record.giaKham).toLocaleString()} VNĐ
        //                     </span>{" "}
        //                 </span>
        //             </>
        //         );
        //     },
        // },
        {
            title: "Chức năng",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    {!record?.trangThaiXacNhan ? (<>
                        <Tooltip
                            title="Hủy lịch này"
                            color={"green"}
                            key={"green"}
                        >
                            <IoMdCloseCircle
                                size={23}
                                style={{
                                    color: "red",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                }}
                                onClick={() => deleteLichHen(record._id)}
                            />
                        </Tooltip>

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
                                    setOpenViewDH(true);
                                    setDataViewDH(record);
                                }}
                            />
                        </Tooltip>

                        {record.trangThaiHuyDon === 'Không Hủy' ? (<>
                            {record.trangThaiXacNhan ? <>
                                <Tooltip
                                    title="Cập nhật ghi chú bệnh án"
                                    color="green"
                                    key="green"
                                >
                                    <RiEdit2Fill
                                        size={23}
                                        onClick={() => {
                                            console.log("record", record);

                                            setIsModalOpen(true)
                                            setDataBenhNhan(record)
                                        }}
                                        style={{
                                            color: "orange",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            fontSize: "18px",
                                        }} />
                                </Tooltip>
                            </> : ''}

                            <Switch
                                loading={loadingXacNhanOrder}
                                checked={record.trangThaiXacNhan}  // Kiểm tra nếu trạng thái là "Đã xác nhận" để bật switch
                                onChange={(checked) => onChangeCheck(checked, record)}
                                checkedChildren="Đã xác nhận"
                                unCheckedChildren="Chờ xác nhận"
                            />
                        </>) : ''}
                    </>) : <>
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
                                    setOpenViewDH(true);
                                    setDataViewDH(record);
                                }}
                            />
                        </Tooltip>

                        {record.trangThaiHuyDon === 'Không Hủy' ? (<>
                            {record.trangThaiXacNhan ? <>
                                <Tooltip
                                    title="Cập nhật ghi chú bệnh án"
                                    color="green"
                                    key="green"
                                >
                                    <RiEdit2Fill
                                        size={23}
                                        onClick={() => {
                                            console.log("record", record);

                                            setIsModalOpen(true)
                                            setDataBenhNhan(record)
                                        }}
                                        style={{
                                            color: "orange",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            fontSize: "18px",
                                        }} />
                                </Tooltip>
                            </> : ''}

                            <Switch
                                loading={loadingXacNhanOrder}
                                checked={record.trangThaiXacNhan}  // Kiểm tra nếu trạng thái là "Đã xác nhận" để bật switch
                                onChange={(checked) => onChangeCheck(checked, record)}
                                checkedChildren="Đã xác nhận"
                                unCheckedChildren="Chờ xác nhận"
                            />
                        </>) : ''}
                    </>}


                    {/* <Tooltip
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
                                setOpenViewDH(true);
                                setDataViewDH(record);
                            }}
                        />
                    </Tooltip>

                    {record.trangThaiHuyDon === 'Không Hủy' ? (<>
                        {record.trangThaiXacNhan ? <>
                            <Tooltip
                                title="Cập nhật ghi chú bệnh án"
                                color="green"
                                key="green"
                            >
                                <RiEdit2Fill
                                    size={23}
                                    onClick={() => {
                                        console.log("record", record);

                                        setIsModalOpen(true)
                                        setDataBenhNhan(record)
                                    }}
                                    style={{
                                        color: "orange",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        fontSize: "18px",
                                    }} />
                            </Tooltip>
                        </> : ''}

                        <Switch
                            loading={loadingXacNhanOrder}
                            checked={record.trangThaiXacNhan}  // Kiểm tra nếu trạng thái là "Đã xác nhận" để bật switch
                            onChange={(checked) => onChangeCheck(checked, record)}
                            checkedChildren="Đã xác nhận"
                            unCheckedChildren="Chờ xác nhận"
                        />
                    </>) : ''} */}


                </Space>
            ),
        },
    ];

    const onChangeCheck = async (checked, record) => {
        console.log("checked: ", checked);

        const updatedStatus = checked ? true : false;  // "Đã xác nhận" khi bật, "Chờ xác nhận" khi tắt

        try {
            setLoadingXacNhanOrder(true)
            const response = await xacNhanLich(record._id, updatedStatus)

            if (response.data) {
                // Ví dụ: cập nhật trạng thái trong data table của bạn
                setDataOrder(prevData => {
                    return prevData.map(acc =>
                        acc._id === record._id ? { ...acc, trangThaiXacNhan: updatedStatus } : acc
                    );
                });

                message.success("Cập nhật trạng thái thành công!");
            }
            setLoadingXacNhanOrder(false)
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            message.error("Cập nhật trạng thái thất bại!");
        }
    };
    const onChangeCheckKham = async (checked) => {
        console.log("checked kham: ", checked);
        setCheckKham(checked)
    };

    useEffect(() => {
        setCheckKham(dataBenhNhan?.trangThaiKham)
        if (dataBenhNhan) {
            const init = {
                _id: dataBenhNhan?._id,
                benhAn: dataBenhNhan?.benhAn,
                trangThaiKham: dataBenhNhan?.trangThaiKham,
            }
            console.log("init: ", init);
            form.setFieldsValue(init);
            if (editorRef.current) {
                editorRef.current.setData(dataUpdateDoctor.benhAn || ''); // Set giá trị cho CKEditor
            }
        }
        return () => {
            form.resetFields();
        }
    }, [dataBenhNhan])

    const handleOk = async (values) => {
        const { _id, benhAn, trangThaiKham } = values
        console.log("benhAn, trangThaiKham: ", benhAn, trangThaiKham);

        setLoadingEditKhamxONG(true)
        if (!trangThaiKham) {
            // form.resetFields();
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: 'Chưa khám thì không được điền bệnh án'
            })
        } else {
            let res = await updateTTBN(_id, benhAn, trangThaiKham)
            if (res) {
                message.success(res.message);
                setIsModalOpen(false)
                form.resetFields();
                await findAllOrder()
            } else {
                notification.error({
                    message: 'Đã có lỗi xảy ra',
                    description: res.message
                })
            }
        }
        setLoadingEditKhamxONG(false)
    }
    const onChangeTheoLoai = async (e) => {
        console.log("e: ", e);

        // Cập nhật state với các giá trị đã lọc
        setSelectedLoaiSP(e);
    }

    return (
        <>
            <Row gutter={[20, 25]}>
                <Col xs={4} sm={4} md={4} span={4}>
                    <Select
                        // size="large"
                        showSearch
                        // mode="multiple"
                        placeholder="Lọc theo trạng thái khám"
                        value={selectedLoaiSP}
                        onChange={(e) => onChangeTheoLoai(e)}
                        style={{
                            width: '100%',
                        }}
                        options={[
                            {
                                value: 'tatca',
                                label: 'Tất cả',
                            },
                            {
                                value: 'choxacnhan',
                                label: 'Chờ xác nhận',
                            },
                            {
                                value: 'chokham',
                                label: 'Chờ khám',
                            },
                            {
                                value: 'dakham',
                                label: 'Đã khám',
                            },
                            {
                                value: 'dahuy',
                                label: 'Đã hủy',
                            },
                        ]}
                        filterOption={(input, option) => {
                            return option.label.toLowerCase().includes(input.toLowerCase()); // Tìm kiếm trong 'label' của từng option
                        }}
                    />
                </Col>
                <Col xs={20} sm={20} md={20} span={20}>
                    <SearchComponent
                        onSearch={(value) => {
                            setSearchValue(value);  // Cập nhật giá trị tìm kiếm
                            findAllOrder(value);    // Gọi hàm tìm kiếm khi có thay đổi
                        }}
                        placeholder="Tìm bệnh nhân theo tên hoặc email hoặc số điện thoại"
                    />

                </Col>

                <Col xs={24} sm={24} md={24} span={24}>
                    <Table
                        onChange={onChange}
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            showSizeChanger: true,
                            total: total,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} lịch hẹn</div>) }
                        }}
                        //  pagination={false}  // Tắt phân trang mặc định của Table
                        loading={loadingOrder}
                        columns={columns}
                        dataSource={dataOrder} />
                </Col>

                <ViewLichHen
                    openViewDH={openViewDH}
                    dataViewDH={dataViewDH}
                    setOpenViewDH={setOpenViewDH}
                    setDataViewDH={setDataViewDH}
                />

                {/* <ModalEdit
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                dataBenhNhan={dataBenhNhan}
                /> */}

                <Modal
                    title={`Chỉnh sửa lịch khám bệnh cho bệnh nhân ${dataBenhNhan?.patientName}`}
                    open={isModalOpen}
                    onOk={() => form.submit()}
                    style={{ marginTop: "50px", height: "1000px" }}
                    width={700}
                    maskClosable={false}
                    loading={loadingEditKhamxONG}
                    onCancel={() => setIsModalOpen(false)}>
                    <Form
                        form={form}
                        onFinish={handleOk}
                        layout="vertical"
                    >
                        <Divider />
                        <Row gutter={[20, 5]}>
                            <Form.Item hidden name="_id" ><Input /></Form.Item>
                            <Col span={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Chi tiết bệnh án"
                                    name="benhAn"
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: 'Vui lòng nhập đầy đủ thông tinị!',
                                //     },                                        
                                // ]}
                                >
                                    {/* <Input.TextArea row={5} style={{ height: "100px" }} /> */}
                                    <CKEditor
                                        editor={ClassicEditor}
                                        config={{
                                            toolbar: [
                                                'heading', '|',
                                                'bold', 'italic', 'underline', '|',
                                                'fontColor', 'fontFamily', '|', // Thêm màu chữ và kiểu chữ
                                                'link', 'bulletedList', 'numberedList', '|',
                                                'insertTable', '|',
                                                'imageUpload', 'blockQuote', 'undo', 'redo'
                                            ],
                                            // Other configurations
                                            ckfinder: {
                                                uploadUrl: `${import.meta.env.VITE_BACKEND_URL}/api/doctor/upload/`, // Đường dẫn đến handler upload  -- van dang loi
                                            },
                                        }}
                                        data={form.getFieldValue('benhAn') || ''} // Thiết lập giá trị từ form
                                        onInit={(editor) => {
                                            editorRef.current = editor; // Gán ref khi CKEditor khởi tạo
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            form.setFieldsValue({ benhAn: data }); // Cập nhật giá trị cho form
                                            console.log({ data }); // Lấy dữ liệu khi có thay đổi
                                        }}
                                        style={{
                                            height: '500px', // Đặt chiều cao cho CKEditor
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Trạng thái khám bệnh"
                                    name="trangThaiKham"
                                >
                                    <Switch
                                        style={{ width: "150px" }}
                                        checked={checkKham}  // Kiểm tra nếu trạng thái là "Đã xác nhận" để bật switch
                                        onChange={(checked) => onChangeCheckKham(checked)}
                                        checkedChildren="Đã khám xong"
                                        unCheckedChildren="Chưa được khám"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <br />
                </Modal>
            </Row>
        </>
    )
}
export default QuanLyLichHen