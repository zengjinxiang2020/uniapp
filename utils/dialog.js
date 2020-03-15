// import {
//   Confirm as confirm,
//   Alert as alert,
//   Toast as toast,
//   Notify as notify,
//   Loading as loading
// } from "vue-ydui/dist/lib.rem/dialog";

// import Dialog from "../../static/vant-weapp/dialog/dialog";
// import notify from "../../static/vant-weapp/notify/notify";

const dialog = {
	confirm: (options) => {
		wx.showModal({
			title: '提示',
			content: options.mes,
			success() {
				if (res.confirm) {
					opts()
				} else if (res.cancel) {}
			}
		})
	},
	alert: null,
	// alert: Dialog.alert,
	notify: null,
	// notify,
	loading: {
		open: () => {
			wx.showLoading({
				title: '加载中'
			})
		},
		close: () => {
			wx.hideLoading()
		}
	}
};

// const icons = { error: "操作失败", success: "操作成功" };
// Object.keys(icons).reduce((dialog, key) => {
//   dialog[key] = (mes, obj = {}) => {
//     return new Promise(function (resolve) {
//       toast({
//         mes: mes || icons[key],
//         timeout: 1000,
//         icon: key,
//         callback: () => {
//           resolve();
//         },
//         ...obj
//       });
//     });
//   };
//   return dialog;
// }, dialog);

dialog.message = (mes = "操作失败", obj = {}) => {
	return new Promise(function(resolve) {
		wx.showToast({
			title: mes,
			icon: "none",
			duration: 2000,
			complete: () => {
				resolve();
			}
		});
	});
};

dialog.toast = (options) => {
	wx.showToast({
		title: options.mes,
		icon: "none",
		duration: 2000,
		complete: () => {
			options.callback ? options.callback() : null
		}
	});
};

dialog.error = (mes) => {
	wx.showToast({
		title: mes,
		icon: "none",
		duration: 2000
	});
};

dialog.validateError = (...args) => {
	validatorDefaultCatch(...args);
};

export function validatorDefaultCatch(err, type = "message") {
	wx.showToast({
		title: err.errors[0].message,
		icon: 'none',
		duration: 2000
	})
	return false
}

export default dialog;
