function PopUp({children, popUpRef}) {
    return (<div className="pop-up-container">
        <div ref={popUpRef} className="pop-up">
            {children}
        </div>
    </div>)
}

export default PopUp;
