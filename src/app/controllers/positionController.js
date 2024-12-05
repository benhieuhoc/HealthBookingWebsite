const Position = require ('../models/Position')

class PositionController {

    // Post /position/create-position
    async create(req,res,next){
        try {
            let {name, description} = req.body               
            
            if (!name) {
                return res.status(400).json({
                    message: "Vui lòng cung cấp đầy đủ thông tin (name)"
                });
            }

            // tìm tên chức vụ bác sĩ chính xác nếu trùng thì không được thêm
            const existingChucVu = await Position.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
            if (existingChucVu) {
                return res.status(409).json({
                    message: "Tên chức vụ đã tồn tại. Vui lòng sử dụng chức vụ khác."
                });
            }            

            let createChucVu = await Position.create({name, description})
            
            if(createChucVu) {
                console.log("thêm thành công chức vụ");
                return res.status(200).json({
                    data: createChucVu,
                    message: "Thêm chức vụ bác sĩ thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Thêm chức vụ bác sĩ thất bại"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi thêm chức vụ bác sĩ.",
                error: error.message,
            });
        }
    }

    // Get /position/show-all-position
    async showall(req,res,next){
        try{
            const { page, limit, name } = req.query;
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const skip = (pageNumber - 1) * limitNumber;
            const query = {};

            if (name) {
                // query.name = { $regex: name, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
                query.name = { $regex: `.*${name}.*`, $options: 'i' }; // Tìm kiếm gần đúng
            }
            
            const totalChucVu = await Position.countDocuments(query); // Đếm tổng số chức vụ
            // console.log('totalChucVu: ', totalChucVu)

            const totalPages = Math.ceil(totalChucVu / limitNumber); // Tính số trang

            Position.find({})
            .skip(skip)
            .limit(limitNumber)
            .then((position) => {
                return res.status(200).json({
                    data: position,
                    totalChucVu,
                    totalPages,
                    currentPage: pageNumber,
                    message: "Đã tìm ra tất cả chức vụ",
                });   
            })
            .catch(next)

        }catch(error){
            return res.status(500).json({
                message: "Có lỗi xảy ra khi tìm chức vụ của bác sĩ.",
                error: error.message,
            });
        }
    }

    // Put /position/update-position
    update(req,res,next){
        try{
            Position.findOneAndUpdate({_id: req.body._id}, req.body)
            .then((position) => {
                if(position){
                    return res.status(200).json({
                        data: position,
                        message: "Chỉnh sửa chức vụ bác sĩ thành công"
                    })
                }else{
                    return res.status(404).json({                
                        message: "Chỉnh sửa chức vụ bác sĩ thất bại"
                    })
                }
            })
            .catch(next);
        }catch(error){
            return res.status(500).json({
                message: "Có lỗi xảy ra khi Chỉnh sửa tài khoản bác sĩ.",
                error: error.message,
            });
        }
    }

    // Delete /position/delete-position/:id
    delete(req,res,next){
        try{
            const _id = req.params.id;
            Position.deleteOne({_id: _id})
            .then((position) => {
                console.log("thành công")
                return res.status(200).json({
                    data: position,
                    message: "Bạn đã xoá chức vụ bác sĩ thành công!"
                })
            })
            .catch(next);
        }catch(error){
            console.log("Thất bại");
            return res.status(500).json({
                message: "Bạn đã xoá chức vụ bác sĩ thất bại!"
            })
        }
    }

}

module.exports = new PositionController;
