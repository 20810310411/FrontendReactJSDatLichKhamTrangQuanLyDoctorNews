import { Col, Divider, Form, Input, message, Modal, notification, Row, Space, Switch, Table, Tag, Tooltip } from "antd"
import { useEffect, useState } from "react"
import moment from 'moment-timezone';
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import React from "react";
import { RiEdit2Fill } from "react-icons/ri";
import { updateTTBN, xacNhanLich } from "../../services/apiDoctor";

const ModalEdit = (props) => {

    const {
        isModalOpen, setIsModalOpen, dataBenhNhan
    } = props
    const [loadingEditKhamxONG, setLoadingEditKhamxONG] = useState(false);
    const [checkKham, setCheckKham] = useState(false);

    const [form] = Form.useForm()
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
        }
        return () => {
            form.resetFields();
        }
    }, [dataBenhNhan])

    const handleOk = async (values) => {
        const { _id, benhAn, trangThaiKham } = values
        console.log("benhAn, trangThaiKham: ", benhAn, trangThaiKham);

        setLoadingEditKhamxONG(true)
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
        setLoadingEditKhamxONG(false)
    }
    return (
        <Modal
            title={`Chỉnh sửa lịch khám bệnh cho bệnh nhân ${dataBenhNhan?.patientName}`}
            open={isModalOpen}
            onOk={() => form.submit()}
            style={{ marginTop: "50px" }}
            width={700}
            maskClosable={false}
            loading={loadingEditKhamxONG}
            onCancel={() => setIsModalOpen(false)}>
            <Form
                form={form}
                onFinish={handleOk}
            >
                <Divider />
                <Row gutter={[20, 85]}>
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
                            <Input.TextArea row={5} style={{ height: "100px" }} />
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
    )
}

export default ModalEdit
