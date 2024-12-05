const Clinic = require ("../models/Clinic");

class clinicController {

    // Get /clinic/show-all-clinic
    async showall(req,res,next){
        try{
            const { page, limit, name, address } = req.query; // Lấy trang và kích thước trang từ query

            // Chuyển đổi thành số
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            // Tính toán số bản ghi bỏ qua
            const skip = (pageNumber - 1) * limitNumber;

            // Tạo query tìm kiếm
            const query = {};
            // Tạo điều kiện tìm kiếm
            if (name || address) {
                const searchKeywords = (name || '') + ' ' + (address || '');
                const keywordsArray = searchKeywords.trim().split(/\s+/);

                const searchConditions = keywordsArray.map(keyword => ({
                    $or: [
                        { name: { $regex: keyword, $options: 'i' } },
                        { address: { $regex: keyword, $options: 'i' } },
                    ]
                }));

                query.$or = searchConditions;
            }

            const totalPhongKham = await Clinic.countDocuments(query); // Đếm tổng số chức vụ

            const totalPages = Math.ceil(totalPhongKham / limitNumber); // Tính số trang
            const listclinic ={};

            Clinic.find(query).skip(skip).limit(limitNumber)
            .then((clinic) => {
                return res.status(200).json({
                data: clinic,
                totalPhongKham,
                totalPages,
                currentPage: pageNumber,
                message: "Đã tìm ra tất cả chức vụ",
            }); 
            })
            .catch(next);

            

        }catch (error){
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi tìm phòng khám của bác sĩ.",
                error: error.message,
            });
        }
    }

    // Delete /clinic/delete-clinic/:id
    delete(req,res,next){
        try{
            const _id = req.params.id;
            Clinic.deleteOne({_id: _id})
            .then((clinic) =>{
                return res.status(200).json({
                    data: clinic,
                    message: "Bạn đã xoá chức vụ bác sĩ thành công!"
                })
            })
            .catch(next);
        }catch(error){
            return res.status(500).json({
                message: "Bạn đã xoá chức vụ bác sĩ thất bại!"
            })
        }
    }

    // Post /clinic/create-clinic
    async create(req,res,next){
        try {
            let {name, address, description , image} = req.body       
            console.log("anhr: ", image);
                    
            
            if (!name || !address) {
                return res.status(400).json({
                    message: "Vui lòng cung cấp đầy đủ thông tin (tên phòng khám, địa chỉ)"
                });
            }                   

            let createPhongKham = await Clinic.create({name, address, description , image})
            
            if(createPhongKham) {
                console.log("thêm thành công phòng khám");
                return res.status(200).json({
                    data: createPhongKham,
                    message: "Thêm phòng khám thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Thêm phòng khám thất bại"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi thêm phòng khám.",
                error: error.message,
            });
        }
    }

    // Put /clinic/update-clinic
    update(req,res){
            console.log("id: ",req.body._id);
            Clinic.findByIdAndUpdate({_id: req.body._id}, req.body)
            .then((clinic) => {
                if(clinic){
                    console.log("Chỉnh sửa thành công chức vụ");
                    return res.status(200).json({
                        data: clinic,
                        message: "Chỉnh sửa chức vụ bác sĩ thành công"
                    })
                }else{
                    return res.status(404).json({                
                        message: "Chỉnh sửa chức vụ bác sĩ thất bại"
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).json({
                    message: "Có lỗi xảy ra khi Chỉnh sửa tài khoản bác sĩ.",
                    error: error.message,
                });
            });
    }

};

module.exports = new clinicController;
