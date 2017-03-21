/**
 * http://usejsdoc.org/
 */
if (!window.CFG) {
    window.CFG = {};

    CFG.DISPLAY_QTY_OK = 1;
    CFG.DISPLAY_QTY_INVALID = 2;
    CFG.DISPLAY_QTY_ROUND_TO_MAX = 3;
    
    CFG.DISPLAY_PRICE_NOEDIT_OK = 1;
    CFG.DISPLAY_PRICE_NOEDIT_INVALID = 2;
    CFG.DISPLAY_PRICE_EDIT_OK = 3;
    CFG.DISPLAY_PRICE_EDIT_INVALID = 4;
    
    CFG.min_qty = function(instr) {
    	try {
	    	var ul = instr.split(' ')[0];
	    	switch (ul) {
	    	case 'HSI':
	    	case 'HSCEI': {
	    		return 100;
	    	}
	    	case 'KS':
    		case 'KS200':
	    	{
	    		return 100;
	    	}
	    	}
    	}
    	catch (err) {
    		alert(err.message);
    	}
		return 10000;	// undefine yet
    }

    CFG.max_leg_qty = function(instr) {
    	try {
    		var ul = instr.split(' ')[0];
    		switch (ul) {
    		case 'HSI':
    		case 'HSCEI': {
    			return 1000;
    		}
    		case 'KS':
    		case 'KS200':
    		{
    			return 1000;
    		}
    		}
    	}
    	catch (err) {
    		alert(err.message);
    	}
    	return 10000;	// undefine yet
    }
    
    CFG.rule_check_qty = function(instr, qty) {
    	try {
	    	var ul = instr.split(' ')[0];
	    	switch (ul) {
	    	case 'HSI':
	    	case 'HSCEI': {
	    		if (qty > 0 && (qty % 1 === 0))
	    			return true;
	    		break;
	    	}
	    	case 'KS':
    		case 'KS200':
	    	{
//	    	case 'KS200': {
	    		if (qty > 0 && ((qty * 100) % 1 === 0))
	    			return true;
	    		break;
	    	}
	    	}
    	}
    	catch (err) {
    		alert(err.message);
    	}
    	return false;
    }
    CFG.rule_check_price = function(instr, price) {
    	try {
    		var ul = instr.split(' ')[0];
    		switch (ul) {
    		case 'HSI':
    		case 'HSCEI': {
    			if (isNaN(price) || Math.abs(price) < 0.0001 || price < 0 || (price % 1 != 0))
    				return false;
    			break;
    		}
    		case 'KS':
    		case 'KS200':
    		{
    			if (isNaN(price) || Math.abs(price) < 0.0001 || price < 0 || ((price * 100) % 1 != 0))
    				return false;
    			break;
    		}
    		}
    	}
    	catch (err) {
    		alert(err.message);
    	}
    	return true;
    }
    CFG.commission = function(tradeCcy, rate, ref, size, pt, myLegs) {
    	try {
    		var ccy = CFG.commissionCcy(tradeCcy);
    		
//    		var ul = instr.split(' ')[0];
    		var notional = ref * size * pt;
    		
    		switch (ccy) {
//    		case 'HSI':
//    		case 'HSCEI': {
    		case 'HKD': {
        		var qty = 0;
        		for (var i=0; i<myLegs.length; i++) {
        			qty += Math.abs(myLegs[i].Qty);
        		}
        		return qty * 20;
    		}
//    		case 'KS':
//    		case 'KS200':
    		case 'USD': {
    			var comm = notional / rate * (0.3 / 10000);
    			comm = Math.round(comm * 100) / 100;
    			return comm;
    		}
    		}
    	}
    	catch (err) {
    		alert(err.message);
    	}
    	return true;
    }
    CFG.commissionCcy = function(tradeCcy) {
		switch (tradeCcy) {
		case 'KRW': 
			return 'USD';
		}
		return tradeCcy;
    }
    CFG.point = function(instr) {
    	try {
    		var ul = instr.split(' ')[0];
    		
    		switch (ul) {
    		case 'HSI':
    		case 'HSCEI': {
    			return 50;
    		}
    		case 'KS':
    		case 'KS200':
    		{
    			return 500000;	// 500,000 KRW/PT
    		}
    		}
    		
    	} catch (err) {
    		alert(err.message);
    	}
    }
//    my_project.some_function = function(){};
}