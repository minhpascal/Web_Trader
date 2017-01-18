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
	    	case 'KS200': {
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
    		case 'KS200': {
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
	    	case 'KS200': {
	    		if (qty > 0 && (qty % 0.01 === 0))
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
    		case 'KS200': {
    			if (isNaN(price) || Math.abs(price) < 0.0001 || price < 0 || (price % 0.01 != 0))
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
//    my_project.some_function = function(){};
}