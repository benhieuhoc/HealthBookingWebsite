const Department = require ('../models/Department')

class departmentController {

    // Post /department/create-department
    async create(req,res,next){
        try {
            let {name, description , image} = req.body       
            console.log("anhr: ", image);
                 
            // tìm tên chuyên khoa bác sĩ chính xác nếu trùng thì không được thêm
            const existingChuyenKhoa = await Department.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
            if (existingChuyenKhoa) {
                return res.status(409).json({
                    message: "Tên chuyên khoa đã tồn tại. Vui lòng sử dụng chuyên khoa khác."
                });
            }  
            
            if (!name) {
                return res.status(400).json({
                    message: "Vui lòng cung cấp đầy đủ thông tin (tên chuyên khoa)"
                });
            }                   

            let createChuyenKhoa = await Department.create({name, description , image})
            
            if(createChuyenKhoa) {
                console.log("thêm thành công chuyên khoa");
                return res.status(200).json({
                    data: createChuyenKhoa,
                    message: "Thêm chuyên khoa thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Thêm chuyên khoa thất bại"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi thêm chuyên khoa.",
                error: error.message,
            });
        }
    }

    // Get /department/show-all-department
    async showall(req,res,next){
        try{
            const { page, limit, name } = req.query; 
            const pageNumber = parseInt(page, 10) || 1; // Mặc định là trang 1 nếu không có
            const limitNumber = parseInt(limit, 10) || 10; // Mặc định là 10 bản ghi mỗi trang
            const skip = Math.max((pageNumber - 1) * limitNumber, 0);
            const query = {};

            if (name) {
                const searchKeywords = (name || '')
                const keywordsArray = searchKeywords.trim().split(/\s+/);

                const searchConditions = keywordsArray.map(keyword => ({
                    name: { $regex: keyword, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
                }));

                query.$or = searchConditions;
            }

            const totalChuyenKhoa = await Department.countDocuments(query); // Đếm tổng số chuyên khoa
            const totalPages = Math.ceil(totalChuyenKhoa / limitNumber); // Tính số trang
            
            Department.find({})
            .skip(skip)
            .limit(limitNumber)
            .then((department) => {
                return res.status(200).json({
                    data: department,
                    totalChuyenKhoa,
                    totalPages,
                    currentPage: pageNumber,
                    message: "Đã tìm ra tất cả chuyên khoa",
                }); 
            })
            .catch(next);
        }catch(error){
            return res.status(500).json({
                message: "Có lỗi xảy ra khi tải danh sách chuyên khoa.",
                error: error.message,
            });
        }
    }

    // Get /department/show-one-department
    showone(req,res,next){
        try{
            Department.findById(req.query.id)
            .then((department) => {
                if(!department){
                    return res.status(404).json({ message: 'Chuyên khoa không tồn tại!' });
                }else{
                    return res.status(200).json({
                        message: "Đã tìm thấy Chuyên khoa",
                        data: chuyenKhoa
                    });
                }
            })
            .catch(next);
        }catch(error){
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    }

    // Put /department/update-department
    update(req,res){
            Department.findOneAndUpdate ({_id: req.body._id}, req.body)
            .then((department) => {
                if(department){
                    return res.status(200).json({
                        data: department,
                        message: "Chỉnh sửa chuyên khoa thành công"
                    })
                }
                else{
                    return res.status(404).json({                
                        message: "Chỉnh sửa chuyên khoa thất bại"
                    })
                }
            })
            .catch((error) => {
                return res.status(500).json({
                    message: "Có lỗi xảy ra khi Chỉnh sửa chuyên khoa.",
                    error: error.message,
                });
            })
    }

    // Delete /department/delete-department/:id
    deltete(req,res,next){
        try{
            const _id = req.params.id
            Department.deleteOne({_id: _id})
            .then((department) => {
                return res.status(200).json({
                    data: department,
                    message: "Bạn đã xoá tài khoản bác sĩ thành công!"
                })
            })
            .catch(next);
        }catch(error){
            return res.status(500).json({
                message: "Bạn đã xoá tài khoản bác sĩ thất bại!"
            })
        }
    }

};

module.exports = new departmentController;
