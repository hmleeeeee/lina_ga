
var commonUi = {};

commonUi.init = function (){
    commonUi.layer.init();
    commonUi.accordion.init();
    commonUi.tab.init();

    var winH = $(window).height();
    $('.cont.only').css('height',winH - 234 + 'px');
    

    $('.layerFull:visible').each(function(){
        var wrap = $(this);
        var scrollInfoVisible = wrap.find('.scrollInfo').length;
        var contentsH = wrap.prop('scrollHeight');
        var footer = wrap.find('.layerFooter');
        var footerHeight = footer.length > 0 ? footer.outerHeight() : "0";

        if(scrollInfoVisible < 1){
            $(this).append(scrollInfo);
        }

        if(contentsH > winH) {
            wrap.find('.scrollInfo').show();
            wrap.find('.scrollInfo').css('bottom',footerHeight + 5)
            setTimeout(function(){
                wrap.find('.scrollInfo').fadeOut();
            },2000)
        }
        if($('.mainIdxWrap')){
            wrap.find('.scrollInfo').hide();
        }
    });

    // datepicker
    $.datepicker.setDefaults({
        dateFormat : 'yy-mm-dd',
        monthNames:['01월','02월','03월','04월','05월','06월','07월','08월','09월','10월','11월','12월'],
        dayNames:['일','월','화','수','목','금','토'],
        dayNamesMin:['일','월','화','수','목','금','토'],
        yearSuffix:'년',
        changeYear: true,
        showMonthAfterYear: true,
        showOn: 'both',
        buttonImage: '../../../../../image/gap/GM/renewal/ico_calender.png', //20210702 이미지 경로 수정
        buttonImageOnly: true,
        buttonText: 'Select Date',
        showButtonPanel: true,
        closeText: '닫기',
    });

    //datepicker 시작일
    $('input[data-style=fromDate]').datepicker({
        beforeShow: function(select){
            var toDateValue = $(this).parents('.formDate').find('input[data-style=toDate]').val();
            
            if(toDateValue === ''){ //종료일 입력 전 오늘까지 입력
                $(this).datepicker("option",{
                    maxDate: 0
                });
            }
            commonUi.selectYear($(select));

            $('body').after('<div class="layerMask"></div>').show();
        },
        onChangeMonthYear: function(y,m,i){
            commonUi.selectYear($(i.input));
        },
        onClose: function(select){
            var toDate = $(this).parents('.formDate').find('input[data-style=toDate]');
            toDate.datepicker("option","minDate",select); //종료일 보다 시작일이 늦을 수 없음

            $('body').next('.layerMask').remove();
        }
    });

    //datepicker 종료일
    $('input[data-style=toDate]').datepicker({
        beforeShow: function(select){            
            $(this).datepicker("option",{ //종료일 오늘까지 입력
                maxDate: 0
            });
            commonUi.selectYear($(select));

            $('body').after('<div class="layerMask"></div>').show();
        },
        onChangeMonthYear: function(y,m,i){
            commonUi.selectYear($(i.input));
        },
        onClose: function(select){
            var fromDate = $(this).parents('.formDate').find('input[data-style=fromDate]');
            fromDate.datepicker("option","maxDate",select); //시작일 보다 종료일이 빠를 수 없음

            $('body').next('.layerMask').remove();
        }
    });

    //datepicker 한개일 때 
    $('input[data-type=date]').each(function(){
        $(this).datepicker({
            onClose: false,
            beforeShow: function(select){
                var limit = $(select).data('limit');
                if(limit === "fromToday"){ //오늘부터 입력 data-limit=fromToday 추가 
                    $(this).datepicker("option",{
                        minDate: 0
                    });
                }else{ //기본 오늘까지 입력
                    $(this).datepicker("option",{
                        maxDate: 0
                    });
                }
                commonUi.selectYear($(select));

                $('body').after('<div class="layerMask"></div>').show();
            },
           
            onChangeMonthYear: function(y,m,i){
                commonUi.selectYear($(i.input));
            },
            onClose:  function(){
                $('body').next('.layerMask').remove();
            }
        });
        $(this).attr('readonly','true');
    });

    
    // 사전안내
    $('.mainIdxWrap').each( function() {
        var mainOwl = $(this).find('.owl-carousel');
        var btnNext = mainOwl.find('.btnNext');

        mainOwl.owlCarousel({
            items : 1,
            margin: -40,
            nav : false,
            autoHeight: true,  
            onInitialize: oninitMain
        });
        mainOwl.on( 'changed.owl.carousel', updateMain );

        function oninitMain( $event ) {            
            btnNext.on( 'click', function( $event ) {
                $event.preventDefault();
                mainOwl.trigger( 'next.owl.carousel' );
            });
        }
        
        function updateMain( $event ) {
            if($event.item.index === 0){
               $('.mainIdxWrap h1').text('전자청약 진행 전 준비사항 1');
            } else if($event.item.index === 1) {
                $('.mainIdxWrap h1').text('전자청약 진행 전 준비사항 2');
            } else {
               $('.mainIdxWrap h1').text('전자청약 순서 안내');
            }
        }
    });

    // 통신사 약관동의
    $('.formLabelGroup').each( function() {
        var chkAll = $(this).find('.chkAll');
        var chk = $(this).find('.chk');

        chkAll.off().on('click',function(){
            if($(this).prop('checked')) {
                $(this).parents('.accordionWrap').removeClass('on');
                $(this).parents('.accordionWrap').find('.contentHidden').slideUp();
                chk.prop('checked',true);
            } else {
                // $(this).parents('.accordionWrap').addClass('on');
                // $(this).parents('.accordionWrap').find('.contentHidden').slideDown();
                chk.prop('checked',false);
            }
        });

        chk.off().on('click',function(){
            if($('.chk:checked').length == 4 ) {
                chkAll.prop('checked',true);
                $(this).parents('.accordionWrap').removeClass('on');
                $(this).parents('.accordionWrap').find('.contentHidden').slideUp();
            } else {
                chkAll.prop('checked',false);
                $(this).parents('.accordionWrap').addClass('on');
                $(this).parents('.accordionWrap').find('.contentHidden').slideDown();
            }
        });
    });

    // 계약전 알릴 의무사항
    $('.formChoice').each(function() {
        var formLabel = $(this).find('.formLabel p');
        if(formLabel.find('span').length < 1){
            formLabel.prepend('<span></span>');
        }

        var contentOn = $(this).find('.contentOn');
        var contentOff = $(this).find('.contentOff');
        var nextCont = $(this).nextAll('.formToggle');

        contentOn.off('click').on('click',function(){
            nextCont.css('display','block');
            nextCont.find('input[type=text],input[type=number]').removeAttr('disabled');
        });
        contentOff.off('click').on('click',function(){
            nextCont.css('display','none');
            nextCont.find('input[type=hidden]').val('');
            nextCont.find('input[type=text],input[type=number]').val('');
            nextCont.find('input[type=text],input[type=number]').attr('disabled','true');
            nextCont.find('input[type=radio]').prop('checked',false);
            nextCont.find('input[type=checkbox]').prop('checked',false);
        });
    });  

};

commonUi.selectYear = function (input) {
    setTimeout(function(){

        var selectDate = $('.ui-datepicker-current');
        
        var selectedYear = $.datepicker._curInst.selectedYear;
        var selectedMonth = $.datepicker._curInst.selectedMonth + 1;
        var selectedDay = $.datepicker._curInst.selectedDay;
        var dayOfWeek = selectedYear + '-' + ('0' + selectedMonth).slice(-2) + '-' + ('0' + selectedDay).slice(-2);

        var week = new Date('' + dayOfWeek + '').getDay();
        var selectedWeek = $.datepicker._defaults.dayNames[week];

        selectDate.text(selectedYear + '년 ' + selectedMonth + '월 ' + selectedDay + '일 ' + selectedWeek + '요일');
        selectDate.attr('disabled','true');


        var yearIdx = $('.ui-datepicker-year option').index($('.ui-datepicker-year option:selected'));
        var yearLength = $('.ui-datepicker-year option').length;
        var nextYearBtn = $('<button class="nextYear">이후 년</button>');
        var preYearBtn = $('<button class="preYear">이전 년</button>');

        $('.ui-datepicker-header')
            .prepend(nextYearBtn)
            .prepend(preYearBtn);
            
        $('.ui-datepicker-year').attr('disabled','true');

        if(yearIdx === 0){
            $('.preYear').addClass('ui-state-disabled');
        }else if(yearIdx === yearLength - 1){
            $('.nextYear').addClass('ui-state-disabled');
        }

        nextYearBtn.unbind('click').bind('click',function(){
            $.datepicker._adjustDate($(input), +1, 'Y');
        });
        preYearBtn.unbind('click').bind('click',function(){
            $.datepicker._adjustDate($(input), -1, 'Y');
        });
        
    },0);
};

commonUi.layer = (function(){
    return {
        init: function(){
            $('.layer:visible,.layerFull:visible').each(function(){
                var wHeight = $(window).height();
                var body = $(this).find('.layerBody');
                var header = $(this).find('.layerHeader');
                var footer = $(this).find('.layerFooter');
                var headerHeight = header.length > 0 ? header.outerHeight() : "0";
                var footerHeight = footer.length > 0 ? footer.outerHeight() : "0";

                if($(this).hasClass('layer')){
                    body.css({ maxHeight: wHeight - headerHeight - footerHeight - 20 + 'px'});
                }else{
                    body.css({ 
                        marginTop: headerHeight + 'px',
                        marginBottom: footerHeight + 'px'
                    });
                }                
                $('#crownix-viewer').css('height', wHeight - 126 + 'px');
            });
            $('.layerFull .txtWrite:visible').each(function() {
                var $txtWrite = $(this); 
                var $formWrite = $txtWrite.find('.formWrite');          
                var _width = $txtWrite.innerWidth();
    
                if($formWrite.length < 1){
                    var formWrite = $('<input type="text" class="formWrite">');  
                    $txtWrite.append(formWrite);
                    $(this).find('.formWrite').css('width',_width);
                }
                
            });
        },
        showPop : function(target){
            $('#' + target).stop().fadeIn();
            commonUi.layer.init();
           
        },
        closePop : function(target){
            if($('#loading')){
                $('#' + target).hide();
            }
            if(target) {
                $('#' + target).stop().fadeOut();
            } else {
                $('.layer,.layerFull').stop().fadeOut();
            }
        }
    }
})();


commonUi.select = (function(){
    return {
        show : function(target){
            var $layerBtm = $('#' + target);
            var $container = $layerBtm.find('.layerContainer');

            setTimeout(function(){
                $container.addClass('on');
            },300)
            $layerBtm.stop().fadeIn();
        },
        close : function(target){            
            var $layerBtm = $('#' + target);
            var $container = $layerBtm.find('.layerContainer');

            $container.removeClass('on');
            $layerBtm.stop().fadeOut();
        }
    }
})();


commonUi.formSelect = function (id,title,...param) {
	var p = param.length == 1 && param instanceof Array ? param[0] : param;
	var layerId = id + 'Layer';
    var layerIdVisible = $('body').find('#'+ layerId).length;

    if(layerIdVisible < 1){
        var layerSelect = '';
        layerSelect += '<div id='+layerId+' class="layerSelect">'
                        + '<div class="layerContainer">'
                        + '    <div class="layerHeader">'
                        + '        <h4>'+title+'</h4>'
                        + '        <button class="btnLayerClose">닫기</button>'
                        + '    </div>'
                        + '    <div class="layerBody">'
                        + '        <div class="contScroll" style="height: 250px;">'
                        + '            <ul class="listformLabel">'   
                        + '            </ul>'
                        + '        </div>'
                        + '    </div>'
                        + '</div>'
                        + '<div class="layerMask"></div>'
                    +  '</div>';
        $('body').append(layerSelect);

        for(i=0; i<p.length; i++){
            var listformLabel = '<li>'  
                                +  '<label class="formLabel">'  
                                +  '    <input type="radio" name="'+id+'list">'  
                                +  '    <p>'+p[i]+'</p>'  
                                +  '</label>'  
                            +  '</li>';      
            $('#'+ layerId).find('.listformLabel').append(listformLabel);      
        }
    }
    
    $('input[name='+id+'list]').on('change', function() {
        var text = $(this).next('p').text();
        $('#'+ id).text(text);
        commonUi.select.close(layerId);
    });

    $('#'+ layerId).find('.btnLayerClose').off().on('click',function(){
        commonUi.select.close(layerId);
    });
};


commonUi.accordion = {
	init : function(){
        $('.accordionWrap').each( function() {
            var accordion = $(this);
            var content = $(this).find('.contentHidden');
            var btn = $(this).find('.btnContentMore');

            if(accordion.hasClass('on')){
                content.css('display','block');
            }else{
                content.css('display','none');
            }

            btn.off('click.acco').on('click.acco',function(){
                if(accordion.hasClass('on')){
                    accordion.removeClass('on');
                    content.slideUp();
                }else{
                    accordion.addClass('on');
                    content.slideDown();
                    if(accordion.hasClass('toggle')){
                        accordion.siblings().removeClass('on');
                        accordion.siblings().find('.contentHidden').slideUp();
                    }
                }
            });
        });
    },
    next : function(target){
        var target = $('#' + target);
        var targetWrap = target.parents('.accordionWrap');
        var nextWrap = targetWrap.next('.accordionWrap');

        target.off().on('click',function(){
            if(!nextWrap.hasClass('on')){
                nextWrap.find('.btnContentMore').trigger('click');
            }
        });
    }
};


commonUi.tab = {
	init : function(){
        var $tab = $('.tab');

        $tab.each( function(n) {
            var i = $(this).find('li');
            var tabWrap = $(this).parents('.tabWrap');
            var tabContent = tabWrap.find('.tabContent');
       
            i.on('click', function() {
                if (!$(this).hasClass('disabled')) {
                    this.idx = $(this).index();
                    $(this).addClass('active').siblings(i).removeClass('active');
                    tabContent.eq(this.idx).addClass('on').siblings(tabContent).removeClass('on');
                }
                
            });  
            
        });
	}
};


$(window).on('load',function(){
    commonUi.init();

    //20210702 head splash 
    setTimeout(function () {
        $('.splash').css({ 'top': '-100%' });
        $('.header').css({ 'margin-top': '0' });

        scrollFixed.init(); // 20210705 계약정보 확인
    }, 2000);
});

$(window).on('resize',function(){
    commonUi.layer.init();
});

// 20210706 청약서류 확인
var nextStep = {
    $wT: null,
    $wH: window.innerHeight,
    $btn: null,
    $area: null,
    $navbar: null,
    $anchor: null,
    $areaT: [],
    $areaData: [],
    className1: 'active',
    className2: 'end',
    scrollStep: function(v) {
        var o = this, gComputedH;
        $(window).on('scroll', function() {
            o.$wT = $(window).scrollTop();
            gComputedH = o.$wT + o.$wH / 2;
            
            if(o.$wT <= o.$area.eq(0).offset().top / 3) {
                o.$navbar.find('[data-scroll]').removeClass(o.className1);
                o.$navbar.removeAttr('style');
            } else {
                o.$navbar.css('top',0);
                if(gComputedH >= o.$area.eq(v).offset().top) {
                    o.$navbar.find('[data-scroll]').removeClass(o.className1);

                    if(v !== 0) {
                        o.$navbar.find('[data-scroll='+o.$anchor.eq(v-1).data('scroll')+']').addClass(o.className2);
                    }
                    o.$navbar.find('[data-scroll='+o.$anchor.eq(v).data('scroll')+']').removeClass(o.className2).addClass(o.className1);
                }
            }
        })
        console.log(v)
    },
    clickBtn: function() {
        var o = this;
        o.$btn.on('click', function() {
            var pageLink = this.id.substr(this.id.length-1,1);
            $('[id=tab'+pageLink+']').show();
            $('html, body').animate({
                scrollTop: o.$areaT[pageLink-1] - o.$navbar.innerHeight() - $('.splash').innerHeight()
            }, 500);
            o.scrollStep(pageLink-1);
        });
    },
    init: function() {
        var o = this;
        o.$btn = $('[id^=btnStep]');
        o.$navbar = $('#navbar');
        o.$anchor = o.$navbar.find('a');
        o.$area = $('[id^=tab]');
        o.$area.each(function(i) {
            o.$areaT.push(o.$area.eq(i).offset().top);
        });
        o.$area.each(function() {
            o.$areaData.push($(this).attr('id'));
        });

        o.$area.hide();
        o.$navbar.find('a').on('click', function(e) {
            e.preventDefault();
        });

        o.clickBtn();
    }
}

// 20210705 계약정보 확인 스크롤 관련 이벤트
var scrollFixed = {
    $wT: null,
    $wH: window.innerHeight,
    $fixedArea1: null,
    $fixedArea1H: null,
    $fixedArea1T: null,
    $fixedArea2: null,
    $fixedArea2H: null,
    $fixedArea2T: null,
    $anchor: null,
    $dataScroll: [],
    className: 'scroll',
    scrollFixed: function() {
        var o = this;
        $(window).on('scroll', function() {
            o.$wT = $(window).scrollTop();
            if(o.$wT >= o.$fixedArea1T - 112) {
                o.$fixedArea1.addClass(o.className);
                o.$fixedArea1.parent().next().css('margin-top', o.$fixedArea1H + 30)
            } else {
                o.$fixedArea1.removeClass(o.className);
                o.$fixedArea1.parent().next().removeAttr('style');
                o.$fixedArea2T = o.$fixedArea2.offset().top;
            }
            if(o.$wT + o.$fixedArea1H >= o.$fixedArea2T) {
                o.$fixedArea2.addClass(o.className);
                o.$fixedArea2.parent().next().css('margin-top', o.$fixedArea2H);
            } else {
                o.$fixedArea2.removeClass(o.className);
                o.$fixedArea2.parent().next().removeAttr('style');
            }
        })
    },
    scrollTab: function() {
        var o = this,
            gAreaH = (o.$wH - o.$fixedArea1H - o.$fixedArea2H) / 2 + (o.$fixedArea1H + o.$fixedArea2H),
            gComputedH = o.$wT + gAreaH,
            className = 'active';

        o.$anchor = o.$fixedArea2.find('a');
        o.$anchor.each(function() {
            o.$dataScroll.push($(this).data('scroll'))
        });

        $(window).on('scroll', function() {
            if(!o.$fixedArea2.hasClass(o.className)) return;
            
            for(key in o.$dataScroll) {
                if(o.$wT + gComputedH >= $('#'+ o.$dataScroll[key]).offset().top) {
                    if(o.$anchor.eq(key-1).hasClass(className)) {
                        o.$anchor.eq(key-1).removeClass(className);
                    }
                    o.$anchor.eq(key).addClass(className);
                } else {
                    o.$anchor.eq(key).removeClass(className);
                }
            }
            
        })
    },
    clickTab: function() {
        var o = this;

        o.$anchor.on('click', function(e) {
            var $tData = $(this).data('scroll');
            e.preventDefault();
            
            for(key in o.$dataScroll) {
                if($tData === o.$anchor.eq(key).data('scroll')) {
                    $('html, body').animate({
                        scrollTop: $('#'+$tData).offset().top - o.$fixedArea1H - o.$fixedArea2H
                    }, 500);
                }
            }
        });

    },
    init: function() {
        var o = this;
        o.$fixedArea1 = $('.contTop .insurBox');
        o.$fixedArea2 = $('.navbar .navMenu');
        
        if(!o.$fixedArea1.length || !o.$fixedArea2.length) return;
        
        o.$fixedArea1H = o.$fixedArea1.innerHeight();
        o.$fixedArea1T = o.$fixedArea1.offset().top;
        o.$fixedArea2H = o.$fixedArea2.innerHeight();
        o.$fixedArea2T = o.$fixedArea2.offset().top;
        o.scrollFixed();
        o.scrollTab();
        o.clickTab();
    }
}