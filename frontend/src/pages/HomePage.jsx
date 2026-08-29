
//Vuong lam
import "./HomePage.css";

function HomePage() {
    const categories = [
        {
            icon: "💻",
            name: "IT / Phần mềm",
            jobs: "1,200+ việc làm",
        },
        {
            icon: "📣",
            name: "Marketing",
            jobs: "850+ việc làm",
        },
        {
            icon: "💼",
            name: "Sales",
            jobs: "920+ việc làm",
        },
        {
            icon: "🎨",
            name: "Thiết kế",
            jobs: "450+ việc làm",
        },
    ];

    const jobs = [
        {
            title: "Senior Frontend Developer (React, TypeScript)",
            company: "TechNova Solutions",
            location: "Hồ Chí Minh",
            type: "Full-time",
            experience: "3+ năm",
            salary: "2,000 - 3,500 USD",
        },
        {
            title: "Digital Marketing Manager",
            company: "Creative Spark Agency",
            location: "Hà Nội",
            type: "Full-time",
            experience: "5+ năm",
            salary: "Thỏa thuận",
        },
        {
            title: "Chuyên viên Phân tích Dữ liệu (Data Analyst)",
            company: "FinTech Global",
            location: "Đà Nẵng",
            type: "Remote",
            experience: "1-3 năm",
            salary: "1,000 - 1,800 USD",
        },
    ];

    return (
        <div className="home-page">

            {/* ================= HEADER ================= */}
            <header className="header">
                <div className="logo">
                    JobFinder
                </div>

                <nav className="nav">
                    <a className="active" href="#">
                        Tìm kiếm
                    </a>

                    <a href="#">
                        Việc làm của tôi
                    </a>

                    <a href="#">
                        Đề xuất
                    </a>
                </nav>

                <div className="header-right">
                    <button className="icon-button">♧</button>
                    <button className="icon-button">♡</button>

                    <button className="login-button">
                        Đăng nhập
                    </button>

                    <div className="avatar">
                        👤
                    </div>
                </div>
            </header>


            {/* ================= HERO ================= */}
            <section className="hero">

                <h1>
                    Tìm công việc phù hợp với bạn
                </h1>

                <p>
                    Khám phá hàng ngàn cơ hội việc làm mới mỗi ngày.
                    Nâng tầm sự nghiệp của<br />
                    bạn cùng JobFinder.
                </p>

                <div className="search-box">

                    <div className="search-input">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Chức danh, từ khóa..."
                        />
                    </div>

                    <div className="search-input">
                        <span>⌖</span>

                        <input
                            type="text"
                            placeholder="Địa điểm..."
                        />
                    </div>

                    <button className="search-button">
                        Tìm kiếm
                    </button>

                </div>

                <div className="filters">

                    <button>Full-time</button>
                    <button>Remote</button>
                    <button>Thực tập</button>
                    <button>Mức lương</button>

                </div>

            </section>


            {/* ================= CATEGORY ================= */}
            <section className="category-section">

                <h2>
                    Ngành nghề phổ biến
                </h2>

                <div className="category-list">

                    {categories.map((category, index) => (
                        <div
                            className="category-card"
                            key={index}
                        >
                            <div className="category-icon">
                                {category.icon}
                            </div>

                            <h3>
                                {category.name}
                            </h3>

                            <p>
                                {category.jobs}
                            </p>
                        </div>
                    ))}

                </div>

            </section>


            {/* ================= LATEST JOBS ================= */}
            <section className="jobs-section">

                <div className="jobs-header">

                    <div>
                        <h2>
                            Việc làm mới nhất
                        </h2>

                        <p>
                            Cơ hội hấp dẫn vừa được cập nhật.
                        </p>
                    </div>

                    <a href="#">
                        Xem tất cả
                    </a>

                </div>


                <div className="job-list">

                    {jobs.map((job, index) => (

                        <div
                            className="job-card"
                            key={index}
                        >

                            <div className="job-top">

                                <div className="company-logo">
                                    🏢
                                </div>

                                <button className="bookmark">
                                    ♡
                                </button>

                            </div>


                            <h3 className="job-title">
                                {job.title}
                            </h3>

                            <p className="company">
                                {job.company}
                            </p>


                            <div className="job-tags">

                                <span>
                                    ⌖ {job.location}
                                </span>

                                <span>
                                    💼 {job.type}
                                </span>

                                <span>
                                    ◷ {job.experience}
                                </span>

                            </div>


                            <div className="job-bottom">

                                <strong>
                                    {job.salary}
                                </strong>

                                <button className="apply-button">
                                    Ứng tuyển
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </div>
    );
}

export default HomePage;