const Handlebar = require('handlebars');

module.exports = {
    layout_button: (user) => {
        if(user){
            if(user.role === 'user'){
                const href1 =  Handlebar.escapeExpression(`/home`);
                const userlaypout = `<li><a href="${href1}" class="smoothScroll">Trang chủ</a></li>
                <li><a href="#about" class="smoothScroll">Thông tin</a></li>
                <li><a href="#team" class="smoothScroll">Bác sĩ</a></li>
                <li><a href="#news" class="smoothScroll">Tin tức</a></li>
                <li><a href="#google-map" class="smoothScroll">Liên hệ</a></li>
                <li class="appointment-btn"><a href="/booking">Đặt lịch</a></li>
                <li><a href="/logout" class="smoothScroll">Đăng xuất</a></li>`;
                return new Handlebar.SafeString(userlaypout);
            }

            if(user.role === 'doctor'){
                const href1 = Handlebar.escapeExpression(`/home`);
                const href2 = Handlebar.escapeExpression(`/calender`);
                const doctorlayout =`<li><a href="${href1}" class="smoothScroll">Lịch trực</a></li>
                <li><a href="#about" class="smoothScroll">Thông tin cá nhân</a></li>
                <li><a href="/logout" class="smoothScroll">Đăng xuất</a></li`;
                return new Handlebar.SafeString(doctorlayout);
            }
        }else{
                const href1 =  Handlebar.escapeExpression(`/home`);
                const userlaypout = `<li><a href="${href1}" class="smoothScroll">Trang chủ</a></li>
                <li><a href="#about" class="smoothScroll">Thông tin</a></li>
                <li><a href="#team" class="smoothScroll">Bác sĩ</a></li>
                <li><a href="#news" class="smoothScroll">Tin tức</a></li>
                <li><a href="#google-map" class="smoothScroll">Liên hệ</a></li>
                <li class="appointment-btn"><a href="/booking">Đặt lịch</a></li>`;
                return new Handlebar.SafeString(userlaypout);
        }
    },
    user_info: (user) => {
        if(user){
            const NameUser = `<span class="email-icon"><i class="fa fa-user-o"></i><a href="#">${user.name}</a></span>`;
            return new Handlebar.SafeString(NameUser);
        }else{
            const NameUser = `<span class="email-icon"><i class="fa fa-user-o"></i><a href="/">Đăng Nhập</a></span>`
                return new Handlebar.SafeString(NameUser);
        }
    },
};
