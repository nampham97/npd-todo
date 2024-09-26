try {
    tw.local.ERROR_SCREEN = {};
    tw.local.ERROR_SCREEN.err_isFall = false;
    var name_temp = '';
    var temp_arr = [];
    console.log('tw.local.Next_user:', tw.local.Next_user);
    temp_arr = tw.local.Next_user.split(",") || []; //Chia ten

    if (tw.local.ot_result_load_name != null && tw.local.ot_result_load_name.length > 0) {
        for (var i = 0; i < tw.local.ot_result_load_name.length; i++) {
            if (tw.local.ot_result_load_name[i].name === tw.local.Workflow_type) {
                //TODO SET WORKFLOW TYPE
                tw.local.Workflow_type = tw.local.ot_result_load_name[i].value;
            }
            for (var z = 0; z < temp_arr.length; z++) {
                if (tw.local.ot_result_load_name[i].name === temp_arr[z]) {
                    name_temp += tw.local.ot_result_load_name[i].value + ",";
                }
            }

        }
    }
console.log('name_temp:', name_temp);
    if (name_temp.length > 0 && name_temp.slice(-1) === ',') {
        name_temp = name_temp.substring(0, name_temp.length - 1);
    }
    // TODO SET NAME   BTT
    tw.local.Next_user = name_temp;

    //SET CPD
    var cpd = '';
    if (tw.local.ot_result_ROLE_NAME != null && tw.local.ot_result_ROLE_NAME.length > 0) {
        for (var j = 0; j < tw.local.ot_result_ROLE_NAME.length; j++) {
            cpd += tw.local.ot_result_ROLE_NAME[j].NAME + ",";
        }
    }
    if (cpd.slice(-1) === ',') {
        cpd = cpd.substring(0, cpd.length - 1);
    }

    //TODO Cap phe duyet
    tw.local.Last_approve = cpd;


    var page = page;


    // NEU INPUT - APPRAISAL : khong co CPD tiep theo
    if (tw.local.int_count_step == 0 && tw.local.lst_Step == undefined) {
        tw.local.Last_approve = '';
    }

    tw.local.data.SPECIFIED_USER_ROUTING.radioChoose = 'a1';
    tw.local.data.SPECIFIED_USER_ROUTING.radioChoose_review_appraisal = 'a1';
    if (!tw.local.data.SPECIFIED_USER_ROUTING.radioChoose_pheduyet || tw.local.data.SPECIFIED_USER_ROUTING.radioChoose_pheduyet == '') tw.local.data.SPECIFIED_USER_ROUTING.radioChoose_pheduyet = 'a1';
    //new
    tw.local.visible_submit_popup.visible_rmtl = 'NONE';
    tw.local.visible_submit_popup.visible_chidinh_review_appraisal_ca13 = 'NONE';
   
    if (tw.local.handler.next_role === 'RM' && tw.local.handler.step < 3 && tw.local.data.LOS_BPM_INFORMATION.TYPE_BDS != "2") {
        tw.local.visible_submit_popup.visible_rmtl = 'EDITABLE';
    }

    tw.local.visible_submit_popup.visible_ho = 'NONE';
    tw.local.visible_submit_popup.visible_layout_pheduyet_chon = 'NONE';
    //HO
    tw.local.visible_submit_popup.visible_chidinh_user = 'NONE';
    if (tw.local.handler.next_role === 'AM_HO' || tw.local.handler.next_role === 'AM_HO_PPCC') {
        tw.local.visible_submit_popup.title_chon_chidinh = 'Cán bộ kiểm soát thẩm định Hội sở:';
        if (tw.local.data.LOS_BPM_INFORMATION.IS_HO) {
            tw.local.visible_submit_popup.visible_chidinh_user = 'EDITABLE';
        } else {
            tw.local.visible_submit_popup.visible_chidinh_user = 'NONE';
        }
    }
    if (tw.local.handler.next_role === 'RM' && tw.local.handler.step < 4) {
        tw.local.visible_submit_popup.title_chon_chidinh = 'Cán bộ thẩm định:';
        if (tw.local.data.LOS_BPM_INFORMATION.TYPE_BDS != '2') {
            tw.local.visible_submit_popup.visible_chidinh_user = 'EDITABLE';
        }
        tw.local.visible_submit_popup.visible_checkbox_rmtl = 'EDITALBE';
    }
    else if (tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE === 'DVKD_TDRR' && tw.local.handler.next_step == "REVIEW_APPRAISAL") {
        tw.local.visible_submit_popup.title_chon_chidinh = 'Cán bộ thẩm định rủi ro chi nhánh:';
        tw.local.visible_submit_popup.visible_chidinh_user = 'EDITABLE';
    }
    else {
        tw.local.visible_submit_popup.visible_checkbox_rmtl = 'READONLY';
    }
    if (tw.local.data.LOS_BPM_INFORMATION.TYPE_BDS === '2') {
        tw.local.visible_submit_popup.visible_rmtl = 'NONE';
        tw.local.visible_submit_popup.visible_chidinh_review_appraisal_ca13 = 'NONE';
    }

    if ((tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE === 'HO' || tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE === 'HO_TTKHCNCC') &&
        (tw.local.handler.next_role === 'AM_HO' || tw.local.handler.next_role === 'AM_HO_PPCC')
    ) {

        tw.local.visible_submit_popup.visible_ho = 'EDITALBE';
        tw.local.visible_submit_popup.visible_checkbox_rmtl = 'NONE';
    }

    if (tw.local.data.LOS_BPM_INFORMATION.TYPE_BDS === "1" && tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE === 'DVKD_TD' && tw.local.handler.step === 1) {
        tw.local.visible_submit_popup.visible_layout_pheduyet_chon = 'EDITABLE';
    }
    if (tw.local.data.LOS_BPM_INFORMATION.TYPE_BDS === "1" && tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE === 'HO' && tw.local.handler.next_role === 'AM_HO') {
        tw.local.visible_submit_popup.visible_layout_pheduyet_chon = 'EDITABLE';
    }


    var ca = tw.local.Rule_ODM_DATA.PROCESS.LastApproval || tw.local.data.LOS_BPM_INFORMATION.LAST_APPROVED;
    if (tw.local.data.LOS_BPM_INFORMATION.TYPE_BDS === "0" || tw.local.data.LOS_BPM_INFORMATION.TYPE_BDS === "1") {
    		if(tw.local.ODM_Result_AM == 'CA13' && tw.local.handler.step <= 2 && tw.local.handler.next_role == 'RM'){
    			tw.local.visible_submit_popup.visible_chidinh_review_appraisal_ca13 = 'EDITABLE';
    		}

        if (tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE === 'HO' && tw.local.handler.next_role === 'AM_HO') {
            tw.local.visible_submit_popup.visible_layout_pheduyet_chon = 'EDITABLE';
        }
        //DVKD_KTDRR/ DVKD_TDRR
        if ((tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE === 'KTDRR' ||
            tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE === 'DVKD_KTDRR' ||
            tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE === 'DVKD_TDRR'
        ) &&
            tw.local.handler.next_role === 'RM' && tw.local.handler.step < 3) {
            tw.local.visible_submit_popup.visible_layout_pheduyet_chon = 'EDITABLE';
        }

    } else {
        page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/layout_chuyentiep_kiemsoat_qlkh').setVisible(false, true);
    }

//    if (ca === "CA4" && (tw.local.data.LOS_BPM_INFORMATION.TYPE_BDS == 2 || tw.local.data.LOS_BPM_INFORMATION.TYPE_BDS == 1) &&
//        (tw.local.data.LOS_BPM_INFORMATION.LINE_GROUP == "LINE_2")
//    ) {
//        tw.local.visible_submit_popup.visible_layout_pheduyet_chon = "NONE";
//    }
    //

    //NEU RESULT
    if (tw.local.isResult) {
        tw.local.Next_user = '';
        console.log(tw.local.Last_approve);

        var nextUser_layout = page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/Horizontal_Layout5');
        nextUser_layout.setVisible(false, true);

        tw.local.data.SPECIFIED_USER_ROUTING.radioChoose = 'a1';
        page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/layout_chi_dinh').setVisible(false, true);

    }
    
    //Hien Thi thong bao ky so
           var lane_result;
        if(tw.local.isResult && tw.local.isResult == true){
        	lane_result = true;
        }else{
        	lane_result = false;
        }
        
      if(tw.local.data.LOS_BPM_INFORMATION.IS_ADJUST != true && lane_result == true){
	if(tw.local.data.LOS_BPM_INFORMATION.IS_BOQUA_KYSO == "TRUE"  || tw.local.check_WCS_KYSO == false){
    		tw.local.vsb_ThongBaoKySo = "EDITABLE";
    		
    	}else{
    		tw.local.vsb_ThongBaoKySo = "NONE";
    		                                                                   
   	}
   	}else{
   		tw.local.vsb_ThongBaoKySo = "NONE";
   	}
   	
    var isRoleLastApproval = '';
    if (tw.local.data.LOS_BPM_INFORMATION.AUTHORITY_CHECK == 0) {
        isRoleLastApproval = tw.local.data.LOS_BPM_INFORMATION.LAST_APPROVED;

    } else {
        if (tw.local.visible_submit_popup.title_chon_chidinh === "Cán bộ thẩm định:") {
            isRoleLastApproval = "AM_BRN";
        }
        if (tw.local.visible_submit_popup.title_chon_chidinh === "Cán bộ kiểm soát thẩm định Hội sở:") {
            isRoleLastApproval = "AC_HO";
        }
    }

    //#TODO Input for getCanbo
    var inputCanbo = {
        handler: tw.local.handler,
        lstStep: tw.local.lst_Step,
        rm_create: tw.local.data.LOS_BPM_INFORMATION.USER_CREATED_CODE,
        isDifferentAM: tw.local.isDifferentAM,
        nextRole: isRoleLastApproval,
        isCurAMRole: tw.local.data.LOS_BPM_INFORMATION.ROLE_UPDATED,
        isROLE_CALL: isRoleLastApproval
    }
    tw.local.inputSC_getDSCanbo = JSON.stringify(inputCanbo);

    //PHEDUYET GETDS
    var inputCanbo_pheduyet = {
        handler: tw.local.handler,
        lstStep: tw.local.lst_Step,
        rm_create: tw.local.data.LOS_BPM_INFORMATION.USER_CREATED_CODE,
        isDifferentAM: tw.local.isDifferentAM,
        nextRole: !tw.local.ODM_Result_AM || tw.local.ODM_Result_AM === '' ? tw.local.Rule_ODM_DATA.PROCESS.LastApproval : tw.local.ODM_Result_AM,
        isCurAMRole: tw.local.data.LOS_BPM_INFORMATION.ROLE_UPDATED,
        is_getca: true,
        step_onlyCA: tw.local.visible_submit_popup.step_onlyCA
    }
    tw.local.visible_submit_popup.inputSC_getDSCanbo_pheduyet = JSON.stringify(inputCanbo_pheduyet);
    //INPUT NO CPD
  
    if (tw.local.run_out == 0) {
        tw.local.Last_approve = '';

        var luong = page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/Horizontal_Layout3');
        luong.setVisible(false, true);
        var cpdshow = page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/Horizontal_Layout4');
        cpdshow.setVisible(false, true);


        //ts
        tw.local.data.SPECIFIED_USER_ROUTING.radioChoose = 'a1';
        page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/layout_chi_dinh').setVisible(false, true);

    }

    // ========================================== SHOW POPUP ================================================



    page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/ms_alert_bpm').setVisible(true, true);
    tw.local.isPopup_finish = true;
    if (tw.local.data.LOS_BPM_INFORMATION.AUTHORITY_CHECK == 0 && (tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE != "HO" && tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE != "HO_TTKHCNCC")) {
        console.log('vao case 1');
        page && page.ui.get('/Template1/LOS_Alert_BPM_Info_21/Horizontal_Layout3').setVisible(true, false);
    }
    else if (tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE == 'HO' && tw.local.data.LOS_BPM_INFORMATION.AUTHORITY_CHECK == 0 && (tw.local.handler.next_role == 'AM_HO' || tw.local.handler.next_role == 'RM' && tw.local.handler.step > 3)) {
        page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/Horizontal_Layout3').setVisible(true, false);
    } else if (tw.local.data.LOS_BPM_INFORMATION.WORKFLOW_TYPE == 'HO_TTKHCNCC' && tw.local.data.LOS_BPM_INFORMATION.AUTHORITY_CHECK == 0) {
        page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/Horizontal_Layout3').setVisible(false, true);
    } else {
        if (tw.local.data.LOS_BPM_INFORMATION.AUTHORITY_CHECK == 0 && !tw.local.isResult) {
            page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/Horizontal_Layout3').setVisible(false, true);
        }
    }

    //TODO set alert with Ca0 & SPTheCC
    page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/alertCa0TheCC').clear();
    if (tw.env.zOpenSPTheCC == 'CHUACO') {
        var grSPThe = tw.env.aGroupSPThe;
        if (tw.local.Rule_ODM_DATA.PROCESS.LastApproval == 'CA0' && grSPThe.search(tw.local.data.LOS_LOAN.LOAN_PRODUCT) > -1) {
            page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/alertCa0TheCC').appendAlert("Thông báo:", "Khách hàng thuộc đối tượng không được cấp tín dụng, Chi nhánh vui lòng hủy giao dịch và xử lý hồ sơ thủ công.", "I");
            page && page.ui.get('/Template1/LOS_Alert_BPM_Info_Specified1/Text3').setVisible(false, true);
        }
    }

} catch (err) {
    tw.local.ERROR_SCREEN = {};
    tw.local.ERROR_SCREEN.err_isFall = true;
    tw.local.ERROR_SCREEN.err_where = 'Mapping Value - Script Complete';
    tw.local.ERROR_SCREEN.err_messages = err.message + "";
}