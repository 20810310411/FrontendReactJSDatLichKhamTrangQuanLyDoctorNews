import { message } from "antd"
import Footer from "../../components/Footer/Footer"
import Header from "../../components/Header/Header"
import { handleLogouDoctort } from "../../services/loginAPI"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { doLogoutAction } from "../../redux/account/accountSlice"
import QuanLyLichHen from "../../components/LichHen/QuanLyLichHen"
import UpdateDoctor from "../../components/ThongTin/UpdateDoctor"
import { useEffect, useState } from "react"
import { fetchAllDoctorByID } from "../../services/apiDoctor"
import KeHoachKhamBenh from "../../components/KeHoachKhamBenh/KeHoachKhamBenh"
import ModalDoiMK from "../../components/ModalDoiMK/ModalDoiMK"
import BenhNhanCuaToi from "../../components/BenhNhanCuaToi/BenhNhanCuaToi"
import CauHoi from "../../components/CauHoi/CauHoi"

const Home = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.accountDoctor.user)
    const navigate = useNavigate()

    const [dataUpdateDoctor, setDataUpdateDoctor] = useState(null);

    const isAuthenticated = useSelector(state => state.accountDoctor.isAuthenticated)
    console.log("isAuthenticated: ", isAuthenticated);

    if (isAuthenticated === false) {
        return <Navigate to="/login-doctor" replace />;
    }

    const timDoctorById = async () => {
        let query = `_id=${user?._id}`
        const res = await fetchAllDoctorByID(query)
        if(res && res.data) {
            setDataUpdateDoctor(res.data)
        }
    }

    useEffect(() => {
        timDoctorById()
    },[user?._id])

    const logoutClick = async () => {
        const res = await handleLogouDoctort()
        if(res) {
          dispatch(doLogoutAction())          
          message.success(res.message)
          navigate('/login-doctor')
        }
    }

    return (
        <>
        <Header/>
        <div className="rts-navigation-area-breadcrumb">
            <div className="container-2">
                <div className="row">
                <div className="col-lg-12">
                    <div className="navigator-breadcrumb-wrapper">
                    <a>Home</a>
                    <i className="fa-regular fa-chevron-right" />
                    <a className="current">Tài khoản của tôi</a>
                    </div>
                </div>
                </div>
            </div>
        </div>


        <div className="account-tab-area-start rts-section-gap">
            <div className="container-2">
                <div className="row">
                <div className="col-lg-3">
                    <div className="nav accout-dashborard-nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <button className="nav-link active" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false"><i className="fa-regular fa-bag-shopping" />Lịch hẹn của tôi</button>
                    <button className="nav-link" id="v-pills-BenhNhan-tab" data-bs-toggle="pill" data-bs-target="#v-pills-BenhNhan" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false"><i className="fa-solid fa-user-injured" />Bệnh nhân của tôi</button>
                    <button className="nav-link" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true"><i className="fa-regular fa-chart-line" />Thông tin của tôi</button>
                    <button className="nav-link" id="v-pills-messages-tab" data-bs-toggle="pill" data-bs-target="#v-pills-messages" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false"><i className="fa-sharp fa-regular fa-tractor" /> Cài đặt lịch trình</button>
                    <button className="nav-link" id="v-pills-cauhoi-tab" data-bs-toggle="pill" data-bs-target="#v-pills-cauhoi" type="button" role="tab" aria-controls="v-pills-cauhoi" aria-selected="false"><i className="fa-sharp fa-regular fa-question-circle" />Câu hỏi của bệnh nhân</button>
                    <button className="nav-link" id="v-pills-settingsa-tab" data-bs-toggle="pill" data-bs-target="#v-pills-settingsa" type="button" role="tab" aria-controls="v-pills-settingsa" aria-selected="false"><i className="fa-light fa-user" />Đổi mật khẩu</button>
                    <button className="nav-link" id="v-pills-settingsb-tab" data-bs-toggle="pill" data-bs-target="#v-pills-settingsb" type="button" role="tab" aria-controls="v-pills-settingsb" aria-selected="false"><a onClick={() => logoutClick()}><i className="fa-light fa-right-from-bracket" />Đăng xuất</a></button>
                    </div>
                </div>
                <div className="col-lg-9 pl--50 pl_md--10 pl_sm--10 pt_md--30 pt_sm--30">
                    <div className="tab-content" id="v-pills-tabContent">

                        {/* order của tôi */}
                        <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" tabIndex={0}>
                            <div className="order-table-account">
                            <div className="h2 title">Lịch làm việc của bác sĩ <span style={{color: "blue"}}>&nbsp;{user?.lastName} {user?.firstName}</span></div>
                            <div className="table-responsive">
                               <QuanLyLichHen/>
                            </div>
                            </div>
                        </div>

                        {/* Bệnh nhân của tôi */}
                        <div className="tab-pane fade" id="v-pills-BenhNhan" role="tabpanel" aria-labelledby="v-pills-BenhNhan-tab" tabIndex={0}>
                            <div className="order-table-account">
                            <div className="h2 title">Bệnh nhân của tôi</div>
                            <div className="table-responsive">
                               <BenhNhanCuaToi/>
                            </div>
                            </div>
                        </div>

                        {/* thông tin account */}
                        <div className="tab-pane fade" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab" tabIndex={0}>
                            <div className="dashboard-account-area">
                            
                            </div>
                            <UpdateDoctor 
                            dataUpdateDoctor={dataUpdateDoctor}
                            setDataUpdateDoctor={setDataUpdateDoctor}
                            />
                        </div>
                        
                        {/* lịch trình */}
                        <div className="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab" tabIndex={0}>
                            <div className="tracing-order-account">
                            <KeHoachKhamBenh/>
                            </div>
                        </div>   

                        {/* câu hỏi */}
                        <div className="tab-pane fade" id="v-pills-cauhoi" role="tabpanel" aria-labelledby="v-pills-cauhoi-tab" tabIndex={0}>
                            <div className="tracing-order-account">
                            <CauHoi/>
                            </div>
                        </div>                       

                        {/* đổi mật khẩu */}
                        <div className="tab-pane fade" id="v-pills-settingsa" role="tabpanel" aria-labelledby="v-pills-settingsa-tab" tabIndex={0}>
                            <ModalDoiMK/>
                        </div>

                        {/* <div className="tab-pane fade" id="v-pills-settingsb" role="tabpanel" aria-labelledby="v-pills-settingsb-tab" tabIndex={0}>...</div> */}
                    </div>
                </div>
                </div>
            </div>
        </div>

        {/* <Footer/> */}
        </>
    )
}
export default Home