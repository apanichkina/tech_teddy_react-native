
import Toast from '@remobile/react-native-toast'

class ToastError {

	constructor(_module) {
		this.module = _module
	}

	long (text, source) {
		if (source) 
			Toast.showLongBottom(this.module+'\n'+source+'\n'+text)
		else 
			Toast.showLongBottom(this.module+'\n'+text)
	}

	short (text, source) {
		if (source) 
			Toast.showShortBottom(this.module+'\n'+source+'\n'+text)
		else 
			Toast.showShortBottom(this.module+'\n'+text)
	}
}

export default ToastError;