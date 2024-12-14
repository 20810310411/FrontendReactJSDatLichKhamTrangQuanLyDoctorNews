import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, message, Modal, notification, Radio, Row, Select, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { fetchAllChucVu, fetchAllChuyenKhoa, fetchAllPhongKham, updateDoctor } from "../../services/apiDoctor";
import { callUploadDoctorImg } from "../../services/doctorAPI";
import { FaSave } from "react-icons/fa";
import './scss.scss'

const UpdateDoctor = (props) => {

    const {
        dataUpdateDoctor, setDataUpdateDoctor,        
    } = props

    const [form] = Form.useForm()
    const editorRef = useRef(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataChucVu, setDataChucVu] = useState([])
    const [dataPhongKham, setDataPhongKham] = useState([])
    const [dataChuyenKhoa, setDataChuyenKhoa] = useState([])   
    const [genderDoctor, setGenderDoctor] = useState(true);
    const [initForm, setInitForm] = useState(null);
    const [fileList, setFileList] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    
    useEffect(() => {
        fetchAllChucVuDoctor()
        fetchAllPhongKhamDoctor()
        fetchAllChuyenKhoaDoctor()
    }, [])

    useEffect(() => {
        if (dataUpdateDoctor?._id) {       
            const chucVuId = Array.isArray(dataUpdateDoctor.chucVuId) 
                            ? dataUpdateDoctor.chucVuId.map(item => item._id) // Nếu là mảng, lấy tất cả _id
                            : [dataUpdateDoctor.chucVuId._id]; // Nếu không, lấy _id từ đối tượng

            const chuyenKhoaId = Array.isArray(dataUpdateDoctor.chuyenKhoaId) 
                            ? dataUpdateDoctor.chuyenKhoaId.map(item => item._id) // Nếu là mảng, lấy tất cả _id
                            : [dataUpdateDoctor.chuyenKhoaId._id]; // Nếu không, lấy _id từ đối tượng

            // Tạo danh sách file cho Upload
            if (dataUpdateDoctor.image) {

                console.log(`ảnh: ${import.meta.env.VITE_BACKEND_URL}/api/doctor/upload/${dataUpdateDoctor.image}`);
                
                
                setFileList([
                    {
                        uid: '-1', // uid phải là một chuỗi duy nhất
                        name: dataUpdateDoctor.image, // Tên file
                        status: 'done', // Trạng thái
                        url: `${import.meta.env.VITE_BACKEND_URL}/uploads/${dataUpdateDoctor.image}`, // Đường dẫn đến hình ảnh
                    },
                ]);
            }

            const init = {
                _id: dataUpdateDoctor._id,
                firstName: dataUpdateDoctor.firstName,
                lastName: dataUpdateDoctor.lastName,
                address: dataUpdateDoctor.address,
                email: dataUpdateDoctor.email,
                password: dataUpdateDoctor.password,
                phoneNumber: dataUpdateDoctor.phoneNumber,
                gender: dataUpdateDoctor.gender,
                mota: dataUpdateDoctor.mota || '',
                chucVuId: chucVuId,
                giaKhamNuocNgoai: dataUpdateDoctor.giaKhamNuocNgoai,
                giaKhamVN: dataUpdateDoctor.giaKhamVN,
                chuyenKhoaId: chuyenKhoaId,
                phongKhamId: dataUpdateDoctor.phongKhamId._id, 
                image: dataUpdateDoctor.image                        
            }
            console.log("init: ", init);
            
            setInitForm(init);  
            setImageUrl(dataUpdateDoctor.image)          
            form.setFieldsValue(init);
            if (editorRef.current) {
                editorRef.current.setData(dataUpdateDoctor.mota || ''); // Set giá trị cho CKEditor
            }
        }
        return () => {
            form.resetFields();
        }
    },[dataUpdateDoctor])

    console.log("dataUpdateDoctor: ", dataUpdateDoctor);
    console.log("imageUrl: ", imageUrl);
   

    const fetchAllChucVuDoctor = async () => {
        let query = `page=1&limit=1000`
        let res = await fetchAllChucVu(query)
        if(res && res.data) {
            setDataChucVu(res.data)
        }
    }
    const fetchAllPhongKhamDoctor = async () => {
        let query = `page=1&limit=1000`
        let res = await fetchAllPhongKham(query)
        if(res && res.data) {
            setDataPhongKham(res.data)
        }
    }
    const fetchAllChuyenKhoaDoctor = async () => {
        let query = `page=1&limit=1000`
        let res = await fetchAllChuyenKhoa(query)
        if(res && res.data) {
            setDataChuyenKhoa(res.data)
        }
    }

    // upload ảnh    
    const handleUploadFileImage = async ({ file, onSuccess, onError }) => {

        setLoading(true);
        try {
            const res = await callUploadDoctorImg(file);
            console.log("res upload: ", res);            
            if (res) {
                setImageUrl(res.url); // URL của hình ảnh từ server
                // // Thêm file mới vào fileList
                // setFileList(prevFileList => [
                //     ...prevFileList,
                //     {
                //         uid: file.uid, // Duy trì uid
                //         name: file.name,
                //         status: 'done',
                //         url: res.url, // URL của hình ảnh từ server
                //     },
                // ]);
                // Cập nhật fileList với file mới 
                setFileList([ // Đặt lại fileList chỉ chứa file mới
                    {
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        url: res.url, // URL của hình ảnh từ server
                    },
                ]);
                onSuccess(file);
                // setDataImage()
                message.success('Upload thành công');
            } else {
                onError('Đã có lỗi khi upload file');
            }            
        } catch (error) {
            console.error(error);
            message.error('Upload thất bại');
            onError(error);
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên hình ảnh JPG/PNG!');
        }
        return isJpgOrPng;
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            message.success(`upload file ${info.file.name} thành công`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} upload file thất bại!`);
        }
    };

    const handleRemoveFile = (file) => {
        // setFileList(prevFileList => prevFileList.filter(item => item.uid !== file.uid)); // Loại bỏ file
        setFileList([]); // Reset fileList khi xóa file
        setImageUrl(''); // Reset URL khi xóa file
        message.success(`${file.name} đã được xóa`);
    };

    const handleUpdateDoctor = async (values) => {

        const { _id, email, password, firstName, lastName, address, phoneNumber, 
            chucVuId, gender, image, chuyenKhoaId, phongKhamId, roleId, mota, thoiGianKhamId, giaKhamVN, giaKhamNuocNgoai, } = values

            console.log("mota: ", mota);
            
        if (!imageUrl) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload hình ảnh'
            })
            return;
        }

        const hinhAnh = imageUrl.split('/').pop(); // Lấy tên file từ URL
        console.log("hinhanh: ", hinhAnh);
        console.log("_id: ", _id);
        
        setIsSubmit(true)
        const res = await updateDoctor( _id, email, firstName, lastName, address, phoneNumber, 
        chucVuId, gender, hinhAnh, chuyenKhoaId, phongKhamId, roleId, mota, giaKhamVN, giaKhamNuocNgoai)

        if(res){
            message.success(res.message);
            handleCancel()
            setImageUrl('')
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        
        setIsSubmit(false)
    }

    const handleCancel = () => {
        setOpenUpdateDoctor(false);
        form.resetFields()
    };

    const handlePreview = async (file) => {
        setImageUrl(fileList[0].url); // Lấy URL của hình ảnh
        setIsModalVisible(true); // Mở modal
    };

    return (
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        name="basic"        
                        layout="vertical"                
                        style={{
                            maxWidth: "100%",
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={handleUpdateDoctor}
                        // autoComplete="off"
                        loading={isSubmit}
                    >
                        <Row gutter={[20,5]}>
                            <Col hidden>
                                <Form.Item  hidden name="_id"><Input /></Form.Item>
                                <Form.Item  hidden name="password"><Input /></Form.Item>
                            </Col>

                            <Col span={5} md={5} sm={5} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Họ"
                                    name="lastName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập họ hiển thị!',
                                        },
                                        {
                                            required: false,
                                            pattern: new RegExp(/^[A-Za-zÀ-ỹ\s]+$/),
                                            message: 'Không được nhập số!',
                                        },
                                    ]}
                                >
                                <Input />
                                </Form.Item>
                            </Col>

                            <Col span={5} md={5} sm={5} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Tên"
                                    name="firstName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên hiển thị!',
                                        },
                                        {
                                            required: false,
                                            pattern: new RegExp(/^[A-Za-zÀ-ỹ\s]+$/),
                                            message: 'Không được nhập số!',
                                        },
                                    ]}
                                >
                                <Input />
                                </Form.Item>
                            </Col>                            

                            <Col span={5} md={5} sm={5} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Số điện thoại"
                                    name="phoneNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập đầy đủ thông tin!',
                                        },
                                        {
                                            pattern: /^0\d{9}$/,
                                            message: 'Số điện thoại phải có 10 chữ số và bẳt đầu bằng số 0, không chứa kí tự!',
                                        },
                                    ]}
                                >
                                <Input />
                                </Form.Item>
                            </Col>

                            <Col span={4} md={4} sm={4} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Giới tính"
                                    name="gender"    
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn giới tính!',
                                        },                                        
                                    ]}                                
                                >
                                    <Radio.Group 
                                        onChange={(e) => {
                                            const genderValue = e.target.value; // true hoặc false
                                            setGenderDoctor(genderValue); // Cập nhật trạng thái
                                            form.setFieldsValue({ gender: genderValue }); // Cập nhật giá trị trong form
                                        }} value={genderDoctor}
                                    >
                                        <Radio value={true}>Nam</Radio>
                                        <Radio value={false}>Nữ</Radio>                                        
                                    </Radio.Group>                       
                                </Form.Item>
                            </Col>
                        </Row>
                        
                        <Row gutter={[20,5]}>
                            <Col span={12} md={12} sm={12} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Địa chỉ Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập đầy đủ thông tin!',
                                        },
                                        {
                                            type: "email",
                                            message: 'Vui lòng nhập đúng định dạng địa chỉ email',
                                        },
                                    ]}
                                >
                                <Input disabled />
                                </Form.Item>
                            </Col>

                            <Col span={12} md={12} sm={12} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập đầy đủ thông tin!',
                                        },                                        
                                    ]}
                                >
                                <Input  />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[30,5]}>
                            <Col span={6} md={6} sm={6} xs={24} >
                                <Form.Item
                                    label="Hình ảnh"
                                    name="image"                            
                                >
                                    {/* <Upload
                                            name="file" // Tên trùng với multer
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}
                                            multiple={false}
                                            customRequest={handleUploadFileImage}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                            onRemove={handleRemoveFile}
                                        >
                                            <div>
                                                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                    </Upload> */}
                                    <Upload
                                        name="file"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        maxCount={1}
                                        multiple={false}
                                        customRequest={handleUploadFileImage}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        onRemove={handleRemoveFile}
                                        fileList={fileList} // Gán danh sách file
                                        onPreview={handlePreview}
                                    >
                                        <div>
                                            {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>

                                    {/* {fileList.length > 0 && (
                                        <div onClick={() => {
                                            setImageUrl(fileList[0].url); // Lấy URL của hình ảnh
                                            setIsModalVisible(true); // Mở modal
                                        }}>
                                            <img
                                                src={fileList[0].url}
                                                alt={fileList[0].name}
                                                style={{ width: '100px', cursor: 'pointer' }} // Style cho ảnh
                                            />
                                        </div>
                                    )} */}

                                    <Modal
                                        visible={isModalVisible}
                                        footer={null}
                                        title="Xem Hình Ảnh"
                                        onCancel={() => setIsModalVisible(false)}
                                    >
                                        <img alt="Uploaded" style={{ width: '100%' }} src={imageUrl} />
                                    </Modal>

                                </Form.Item>
                            </Col>

                            <Col span={18} md={18} sm={18} xs={24} >
                                <Form.Item
                                    layout="vertical"
                                    label="Phòng khám"
                                    name="phongKhamId"    
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn phòng khám!',
                                        },                                        
                                    ]}                                
                                >
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Chọn phòng khám"
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={dataPhongKham.map(phongKham => ({
                                            value: phongKham._id, // Sử dụng _id làm giá trị
                                            label: `${phongKham.name} ( ${phongKham.address} )`, // Hiển thị name và address
                                        }))}
                                    />                               
                                </Form.Item>
                            </Col>  

                            <Col span={12} md={12} sm={12} xs={24}>
                                <Form.Item
                                    label="Giá khám cho người Việt"
                                    name="giaKhamVN"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập Giá khám cho người Việt!',
                                        },
                                    ]}
                                >
                                   <InputNumber 
                                   style={{width: "100%"}}
                                    formatter={value => 
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    addonAfter={"VNĐ"} 
                                    min={1} />
                                </Form.Item>       
                            </Col>

                            <Col span={12} md={12} sm={12} xs={24}>
                                <Form.Item
                                    label="Giá khám cho người Nước Ngoài"
                                    name="giaKhamNuocNgoai"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập Giá khám cho người Nước Ngoài!',
                                        },
                                    ]}
                                >
                                   <InputNumber 
                                   style={{width: "100%"}}
                                    formatter={value => 
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    addonAfter={"VNĐ"} 
                                    min={1} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[20,5]}>
                            <Col span={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Chức vụ"
                                    name="chucVuId"    
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ít nhất 1 chức vụ!',
                                        },                                        
                                    ]}                                
                                >
                                    <Checkbox.Group>
                                        {dataChucVu.map((chucVu) => (
                                            <Checkbox 
                                                style={{
                                                    margin: "10px"
                                                }}
                                                key={chucVu._id}
                                                value={chucVu._id}
                                            >
                                                {chucVu.name}
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>                                    
                                </Form.Item>
                            </Col>

                            <Col span={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Chuyên khoa"
                                    name="chuyenKhoaId"    
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ít nhất 1 Chuyên khoa!',
                                        },                                        
                                    ]}                                
                                >
                                    <Checkbox.Group>
                                        {dataChuyenKhoa.map((chuyenKhoa) => (
                                            <Checkbox 
                                                style={{
                                                    margin: "10px"
                                                }}
                                                key={chuyenKhoa._id}
                                                value={chuyenKhoa._id}
                                            >
                                                {chuyenKhoa.name}
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>                                    
                                </Form.Item>
                            </Col>                            
                        </Row>         

                        <Row>
                            <Col span={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Mô tả"
                                    name="mota"    
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập 1 chút mô tả!',
                                        },                                        
                                    ]}                                
                                >
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
                                        data={form.getFieldValue('mota') || ''} // Thiết lập giá trị từ form
                                        onInit={(editor) => {
                                            editorRef.current = editor; // Gán ref khi CKEditor khởi tạo
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            form.setFieldsValue({ mota: data }); // Cập nhật giá trị cho form
                                            console.log({ data }); // Lấy dữ liệu khi có thay đổi
                                        }}
                                        style={{
                                            height: '400px', // Đặt chiều cao cho CKEditor
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                            <Button onClick={() => form.submit()} type="primary" size="large" icon={<FaSave size={25} />}>Đổi thông tin</Button>
                        </Col>

                        <Divider />
                    </Form>
                </Col>
            </Row>
    )
}
export default UpdateDoctor