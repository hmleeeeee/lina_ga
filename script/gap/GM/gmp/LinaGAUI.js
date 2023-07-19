//LISA UI
window.LINAGAUI = {};

const GlobalUI = window.LINAGAUI;

GlobalUI.helpTip = {
    init: function(){
        const closes = document.querySelectorAll('[data-helptiphide]');

        for (let that of closes) {
            that.addEventListener('click', act);
        }

        function act() {
            const idname = this.dataset.helptiphide;
            
            GlobalUI.helpTip.hide({
                id : idname
            });
        }

        GlobalUI.helpTip.show();
    },
    show: function(opt){
        const el_helpTips = document.querySelectorAll('.helpTip');

        for (let that of el_helpTips) {
            const time = that.dataset.time;

            setTimeout(function(){
                that.classList.add('on');
                if (!!time) {
                    setTimeout(function(){
                        that.classList.remove('on');
                    }, (time * 1000));
                }
            }, 2300);
        }
    },
    hide: function(opt) {
        const el_helpTip = document.querySelector('.helpTip[data-id="'+ opt.id +'"]');
        
        el_helpTip.classList.remove('on');
    }
}

GlobalUI.toast = {
    timer : null,
    /**
     * options 
     * delay: short[2s] | long[3.5s]
     * status: assertive[중요도 높은 경우] | polite[중요도가 낮은 경우] | off[default]
     */
    options : {
        delay: 'short',
        classname : '',
        conts: '',
        status: 'assertive' 
    },
    show : function(option) {
        const opt = {...this.options, ...option};
        //const opt = Object.assign({}, this.options, option);
        const {delay, classname, conts, status} = opt;
        const el_body = document.querySelector('body');

        let toast = '<div class="ui-toast toast '+ classname +'" aria-live="'+ status +'">'+ conts +'</div>';
        let time = (delay === 'short') ? 2000 : 3500;

        if (delay === 'short') {
            time = 2000;
        } else if(delay === 'long') {
            time = 3500;
        }  else if(delay === 'infinite') {
            time = false;
        }else {
            time = delay;
        }

        if (!!document.querySelector('.ui-toast-ready')) {
            clearTimeout(GlobalUI.toast.timer);
            el_body.classList.remove('ui-toast-show');
            el_body.classList.remove('ui-toast-ready');
            document.querySelector('.ui-toast').removeEventListener('transitionend', act);
            document.querySelector('.ui-toast').remove();
        } 

        el_body.insertAdjacentHTML('beforeend', toast);
        toast = null;
        
        const el_toast = document.querySelector('.ui-toast');
        
        el_body.classList.add('ui-toast-ready');

        setTimeout(function(){
            el_body.classList.add('ui-toast-show');
            el_toast.addEventListener('transitionend', act);
        },0);

        function act(e){
            const that = e.currentTarget;

            that.removeEventListener('transitionend', act);
            that.classList.add('on');

            if (!!time) {
                GlobalUI.toast.timer = setTimeout(GlobalUI.toast.hide, time);
            }
        }
    },
    hide : function(){
        const el_body = document.querySelector('body');
        const el_toast = document.querySelector('.ui-toast');

        if (!!el_toast) {
            clearTimeout(GlobalUI.toast.timer);
            el_body.classList.remove('ui-toast-show');

            el_toast.removeEventListener('transitionend', act);
            el_toast.addEventListener('transitionend', act);

            function act(e){
                const that = e.currentTarget;

                that.removeEventListener('transitionend', act);
                that.remove();
                el_body.classList.remove('ui-toast-ready');
            }
        }
    }
}

GlobalUI.textCheck = {
    init: function(){
        const el_text = document.querySelectorAll('.ui-textcheck');
        const len =  el_text.length;

        for (let i = 0; i < len; i++) {
            el_text[i].dataset.n = i;
            const el_inp =  el_text[i].querySelector('.text-inp');
            const el_shadow =  el_text[i].querySelector('.text-shadow');
            console.log(el_inp.dataset.text.length);

            //el_inp.addEventListener('focus', reset);
            el_inp.addEventListener('keyup', act);
            el_inp.addEventListener('blur', act);
        }
        function reset(){
            const wrap = this.closest('.ui-textcheck');
            wrap.classList.remove('complete');
            wrap.classList.remove('error');
            wrap.classList.remove('success');
            
            this.value = "";
        }
        function act() {
            const wrap = this.closest('.ui-textcheck');
            const org_text = this.dataset.text;
            const val_text = this.value;
            const n = val_text.length - 1;
            const sp_org = org_text.split('');
            const sp_val = val_text.split('');

            let success = true;
            for (let i = 0; i <= n; i++) {
                if (sp_org[i] === sp_val[i] && success) {
                    success = true;
                    wrap.classList.add('success');
                    wrap.classList.remove('error');
                    wrap.classList.remove('complete');
                } else {
                    success = false;
                    wrap.classList.add('error');
                    wrap.classList.remove('success');
                    wrap.classList.remove('complete');
                }
            }

            if (org_text === val_text) {
                wrap.classList.add('complete');
                wrap.classList.remove('error');
                wrap.classList.remove('success');
                this.disabled = true;

                if ((Number(wrap.dataset.n) + 1) < len) {
                    document.querySelector('.ui-textcheck[data-n="'+ (Number(wrap.dataset.n) + 1) +'"] .text-inp').focus();
                }
            }

        }
    }
}
