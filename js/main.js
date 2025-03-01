/* Footer */
footer {
    background-color: #121212;
    color: #999;
    padding: 80px 0 30px;
}

.footer-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
    margin-bottom: 50px;
}

.footer-col h3 {
    color: white;
    font-size: 20px;
    margin-bottom: 25px;
    position: relative;
}

.footer-col h3::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 50px;
    height: 2px;
    background-color: var(--primary);
}

.footer-links {
    list-style: none;
}

.footer-links li {
    margin-bottom: 12px;
}

.footer-links a {
    color: #999;
    text-decoration: none;
    transition: color 0.3s ease;
    position: relative;
    padding-left: 15px;
}

.footer-links a::before {
    content: '→';
    position: absolute;
    left: 0;
    opacity: 0;
    transition: all 0.3s ease;
}

.footer-links a:hover {
    color: white;
    padding-left: 20px;
}

.footer-links a:hover::before {
    opacity: 1;
}

.footer-contact p {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
}

.footer-contact-icon {
    margin-right: 10px;
    color: var(--primary);
}

.footer-social {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.social-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #333;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    text-decoration: none;
}

.social-icon:hover {
    background-color: var(--primary);
    transform: translateY(-5px);
}

.footer-payment {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 20px;
}

.payment-icon {
    width: 50px;
    height: 30px;
    background-color: white;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
}

.footer-bottom {
    border-top: 1px solid #333;
    padding-top: 20px;
    text-align: center;
    font-size: 14px;
}

.footer-bottom a {
    color: var(--primary);
    text-decoration: none;
}

/* Media Queries */
@media screen and (max-width: 768px) {
    .footer-container {
        grid-template-columns: 1fr;
    }
    
    .footer-col {
        text-align: center;
    }
    
    .footer-col h3::after {
        left: 50%;
        transform: translateX(-50%);
    }
    
    .footer-links a {
        padding-left: 0;
    }
    
    .footer-links a::before {
        display: none;
    }
    
    .footer-social {
        justify-content: center;
    }
}
