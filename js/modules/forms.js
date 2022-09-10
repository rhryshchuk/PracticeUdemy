import { closeModal, openModal } from './modal';
import { postData } from '../services/services';

function forms(formSelector,modalTimerId) {
 //Forms

    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Дякуємо. Скоро з вами звяжуться',
        failure: 'Щось пішло не так...'
    };
    forms.forEach(item => {
        bindPostData(item);
    });

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;
            // form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);

            
            // request.setRequestHeader('Cotent-type', 'multipart/form-data');
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            // fetch('server.php', {
            //     method: "POST",
            //     // headers: {
            //     //     'Cotent-type': 'application/json'
            //     // },
            //     body: formData
            // })
            postData('http://localhost:3000/requests', json)
                // .then(data => data.text())
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                });

            // const object = {};
            // formData.forEach(function (value, key) {
            //     object[key] = value; 
            // });
            // const json = JSON.stringify(object);
            // request.send(json);
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal('.modal',modalTimerId);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>&times;</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal('.modal');
        }, 4000);
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));
    
}
export default forms;