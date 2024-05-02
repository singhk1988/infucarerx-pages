document.addEventListener("DOMContentLoaded", function () {
    const toastContainer = document.createElement('div');
    toastContainer.className = "toast-container position-fixed top-0 end-0 p-2";
    document.body.appendChild(toastContainer);

    const notifyToast = document.createElement('template');
    notifyToast.id = 'notify-toast';
    notifyToast.innerHTML = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body"></div>
        </div>
    `;
    document.body.appendChild(notifyToast);

    const confirmModaltemplate = document.createElement('template');
    confirmModaltemplate.id = 'confirm-modal-template';
    confirmModaltemplate.innerHTML = `
        <div class="modal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header"></div>
                    <div class="modal-body p-2"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary">Cancel</button>
                        <button type="button" class="btn btn-primary">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(confirmModaltemplate);
});

function commonModal(modalTemplateId, buildFn) {
    const modalEle = document.body.appendChild(document.querySelector(modalTemplateId).content.firstElementChild.cloneNode(true));
    const modalObj = new bootstrap.Modal(modalEle, {});
    modalObj.close = ()=>{
        modalObj.hide();
        modalEle.remove();
    };

    // build the modal
    buildFn?.(modalObj, modalEle);

    modalObj.show();
    return modalObj;
}

function confirmModal(title, content, onOK, onCancel) {
    return commonModal('#confirm-modal-template', (modalObj, modalEle)=>{
        modalEle.querySelector('.modal-header').innerHTML = title;
        modalEle.querySelector('.modal-body').innerHTML = content;
        modalEle.querySelector('.btn-primary').addEventListener('click', ()=>{
            onOK?.(modalObj.close);
        });
        modalEle.querySelector('.btn-outline-secondary').addEventListener('click', ()=>{
            onCancel?.();
            modalObj.close();
        });
    });
}


function notify(message='', alert='info', options={}) {
    const toastEle = document.body.appendChild(document.querySelector('#notify-toast').content.firstElementChild.cloneNode(true));
    document.querySelector('.toast-container').appendChild(toastEle);
    const toastObj = new bootstrap.Toast(toastEle, {
        animation: false,
        ...options,
    });

    toastEle.addEventListener('hidden.bs.toast', ()=>{
        toastEle.remove();
    });

    toastEle.querySelector('.toast-body').innerHTML = message;
    toastEle.querySelector('.toast-body').className += ` alert alert-${alert}`;
    toastObj.show();
}