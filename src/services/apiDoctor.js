import axios from "../utils/axios-customize"

// doctor
export const fetchAllDoctor = (query) => {
    const URL_BACKEND = `/api/doctor/fetch-all-doctor?${query}`
    return axios.get(URL_BACKEND)
}
export const fetchAllDoctorByID = (query) => {
    const URL_BACKEND = `/api/doctor/fetch-doctor-by-id?${query}`
    return axios.get(URL_BACKEND)
}
export const callCreateDoctor = (email, password, firstName, lastName, address, phoneNumber, chucVuId, gender, image, chuyenKhoaId, phongKhamId, mota, giaKhamVN, giaKhamNuocNgoai) => {
    return axios.post('/api/doctor/create-doctor', {
        email, password, firstName, lastName, address, phoneNumber, chucVuId, gender, image, chuyenKhoaId, phongKhamId, mota, giaKhamVN, giaKhamNuocNgoai
    })
}
export const updateDoctor = (_id, email, firstName, lastName, address, phoneNumber, chucVuId, gender, image, chuyenKhoaId, phongKhamId, roleId, mota, giaKhamVN, giaKhamNuocNgoai) => {
    return axios.put('/api/doctor/update-doctor', {
        _id, email, firstName, lastName, address, phoneNumber, chucVuId, gender, image, chuyenKhoaId, phongKhamId, roleId, mota, giaKhamVN, giaKhamNuocNgoai
    })
}
export const deleteDoctor = (_id) => {
    return axios.delete(`/api/doctor/delete-doctor/${_id}`)
}

export const deleteLichHenn = (_id) => {
    return axios.delete(`/api/doctor/delete-lich-hen/${_id}`)
}


// chuyen khoa
export const fetchAllChuyenKhoa = (query) => {
    const URL_BACKEND = `/api/doctor/fetch-all-chuyen-khoa?${query}`
    return axios.get(URL_BACKEND)
}
export const fetchChuyenKhoaByID = (query) => {
    const URL_BACKEND = `/api/doctor/fetch-chuyen-khoa-by-id?id=${query}`
    return axios.get(URL_BACKEND)
}
export const createChuyenKhoa = (name, description, image) => {
    return axios.post('/api/doctor/create-chuyen-khoa', {
        name, description, image
    })
}
export const deleteChuyenKhoa = (_id) => {
    return axios.delete(`/api/doctor/delete-chuyen-khoa/${_id}`)
}
export const updateChuyenKhoa = (_id, name, description, image) => {
    return axios.put('/api/doctor/update-chuyen-khoa', {
        _id, name, description, image
    })
}


//  chuc vu
export const fetchAllChucVu = (query) => {
    const URL_BACKEND = `/api/doctor/fetch-all-chuc-vu?${query}`
    return axios.get(URL_BACKEND)
}
export const createChucVu = (name, description) => {
    return axios.post('/api/doctor/create-chuc-vu', {
        name, description
    })
}
export const deleteChucVu = (_id) => {
    return axios.delete(`/api/doctor/delete-chuc-vu/${_id}`)
}
export const updateChucVu = (_id, name, description) => {
    return axios.put('/api/doctor/update-chuc-vu', {
        _id, name, description
    })
}


// phong kham
export const fetchAllPhongKham = (query) => {
    const URL_BACKEND = `/api/doctor/fetch-all-phong-kham?${query}`
    return axios.get(URL_BACKEND)
}
export const createPhongKham = (name, address, description, image) => {
    return axios.post('/api/doctor/create-phong-kham', {
        name, address, description, image
    })
}
export const deletePhongKham = (_id) => {
    return axios.delete(`/api/doctor/delete-phong-kham/${_id}`)
}
export const updatePhongKham = (_id, name, address, description, image) => {
    return axios.put('/api/doctor/update-phong-kham', {
        _id, name, address, description, image
    })
}

// fetch time
export const fetchAllTime = () => {
    const URL_BACKEND = `/api/doctor/fetch-all-time-gio`
    return axios.get(URL_BACKEND)
}
export const fetchAllTime2 = (doctorId, date) => {
    const URL_BACKEND = `/api/doctor/fetch-all-time-gio?doctorId=${doctorId}&date=${date}`;
    return axios.get(URL_BACKEND);
}
export const getTimeSlotsByDoctorAndDate = (query) => {
    const URL_BACKEND = `/api/doctor/get-time-slots?${query}`
    return axios.get(URL_BACKEND)
}

// them thoi gian kham benh
export const addTimeKhamBenh = (date, time, _id) => {
    return axios.post('/api/doctor/add-time', {
        date, time, _id
    })
}
// xoa lich cu
export const xoaLichCu = (_id) => {
    return axios.post('/api/doctor/delete-old-time-slots', { _id: _id })
}

// upload hình ảnh
export const callUploadDoctorImg = (file) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    return axios({
        method: 'post',
        url: '/api/doctor/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });
}

// tim ra doctor thong qua id
export const fetchDoctorById = (id) => {
    const URL_BACKEND = `/api/doctor/view-doctor?id=${id}`
    return axios.get(URL_BACKEND)
}

// hiển thị info doctor kèm theo thgian khám cho page đặt lịch khám
export const fetchDoctorByNgayGio1 = (id, idGioKhamBenh, ngayKham) => {
    const URL_BACKEND = `/api/doctor/page-dat-lich-kham?id=${id}&idGioKhamBenh=${idGioKhamBenh}&ngayKham=${ngayKham}`
    return axios.get(URL_BACKEND)
}
export const fetchDoctorByNgayGio = (query) => {
    const URL_BACKEND = `/api/doctor/page-dat-lich-kham${query}`
    return axios.get(URL_BACKEND)
}

// dat lich kham
export const datLichKhamBenh = (
    _idDoctor, _idTaiKhoan, patientName, email,
    gender, phone, dateBenhNhan, address, lidokham,
    hinhThucTT, tenGioKham, ngayKhamBenh, giaKham
) => {
    const data = {
        _idDoctor, _idTaiKhoan, patientName, email,
        gender, phone, dateBenhNhan, address, lidokham,
        hinhThucTT, tenGioKham, ngayKhamBenh, giaKham
    }
    return axios.post('/api/doctor/dat-lich-kham', data)
}

// get lich kham
export const fetchLichKham = (idKhachHang) => {
    const URL_BACKEND = `/api/doctor/lich-hen?idKhachHang=${idKhachHang}`
    return axios.get(URL_BACKEND)
}

// tim bac si thong qua id chuyen khoa
export const fetchDoctorByChuyenKhoa = (idChuyenKhoa) => {
    const URL_BACKEND = `/api/doctor/doctor-chuyen-khoa?idChuyenKhoa=${idChuyenKhoa}`
    return axios.get(URL_BACKEND)
}

export const handleHuyOrder = (query) => {
    const URL_BACKEND = `/api/doctor/huy-order?idHuy=${query}`
    return axios.post(URL_BACKEND)
}

export const findAllLichHen = (query) => {
    const URL_BACKEND = `/api/doctor/find-all-order?${query}`
    return axios.get(URL_BACKEND)
}

// -----------------------
export const xacNhanLich = (id, trangThaiXacNhan) => {
    return axios.put('/api/doctor/edit-xacnhan-lich', {
        id, trangThaiXacNhan
    })
}
export const updateTTBN = (_id, benhAn, trangThaiKham) => {
    return axios.put('/api/doctor/edit-thongtinkham', {
        _id, benhAn, trangThaiKham
    })
}

export const fetchCauHoi = (query) => {
    const URL_BACKEND = `/api/cauhoi/get-cau-hoi?${query}`
    return axios.get(URL_BACKEND)
}

export const traLoiCauHoiChoBN = (_id, cauTraLoi, cauHoi, status, email, firstName, lastName, idDoctor) => {
    return axios.put('/api/cauhoi/tra-loi-cau-hoi', {
        _id, cauTraLoi, cauHoi, status, email, firstName, lastName, idDoctor
    })
}