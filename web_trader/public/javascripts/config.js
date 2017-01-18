/**
 * http://usejsdoc.org/
 */
if (!window.CONFIG) {
    window.CONFIG = {};

    CONFIG.SOME_CONFIGURATION_VALUE = 1;
    CONFIG.rule_check_qty = function(instr, qty) {
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
    CONFIG.rule_check_price = function(instr, price) {
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