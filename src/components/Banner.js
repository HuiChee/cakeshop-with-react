import React from 'react';
import '../styles/banner.css'

const Banner = () => {
    /*useEffect(() => {
        if (window.bootstrap) {
            console.log('Bootstrap JavaScript is loaded.');
            new window.bootstrap.Carousel(document.getElementById('banner'));
        } else {
            console.error('Bootstrap JavaScript is no loaded.');
        }
    },[]);*/

    return(
        <div id="banner" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#banner" data-bs-slide-to="0" className="active"></button>
                <button type="button" data-bs-target="#banner" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#banner" data-bs-slide-to="2"></button>
                <button type="button" data-bs-target="#banner" data-bs-slide-to="3"></button>
            </div>

            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="/images/banner/banner1.png" alt="莓莓酸奶马卡龙" className="d-block w-100" />
                </div>
                <div className="carousel-item">
                    <img src="/images/banner/banner2.png" alt="葡萄柚马卡龙" className="d-block w-100" />
                </div>
                <div className="carousel-item">
                    <img src="/images/banner/banner3.png" alt="椰奶百香果马卡龙" className="d-block w-100" />
                </div>
                <div className="carousel-item">
                    <img src="/images/banner/banner4.png" alt="奶酪覆盆子马卡龙" className="d-block w-100" />
                </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#banner" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#banner" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
            </button>
        </div>
    );
};

export default Banner;