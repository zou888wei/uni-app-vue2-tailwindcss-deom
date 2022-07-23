# uni-app vue2 tailwindcss 强制横屏模板

> 已经支持 tailwindcss jit 模式!

[English](./README_en.md)

这是一个使用 `vue2` 来开发 `uni-app` 的模板,辅助以小程序定制化的 `tailwindcss`

由于受到 `@vue/cli-service` `4.x`版本中 `postcss 7.x` 的限制 , 所以 `tailwindcss` 降低了些版本

目前建议用此版本而不是 `vue3` 因为, 3 版本的 `uni-app` 生态并没有建立起了。

举个例子，vue3 可以使用 原先的控件库，会存在很多的 bug


## 取消横屏模式

* pages.json中globalStyle里移除以下代码
```json
	{
		"globalStyle": {
			"rpxCalcMaxDeviceWidth": 2560, // rpx 计算所支持的最大设备宽度，单位 px，默认值为 960
			"rpxCalcBaseDeviceWidth": 1280, // rpx 计算使用的基准设备宽度，设备实际宽度超出 rpx 计算所支持的最大设备宽度时将按基准宽度计算，单位 px，默认值为 375
			"rpxCalcIncludeWidth": 2560, // rpx 计算特殊处理的值，始终按实际的设备宽度计算，单位 rpx，默认值为 750

			"app-plus": {
				"titleView": false
			}
		}
	}
```

* manifest.json中app-plus移除以下代码

```json
	{
		"app-plus": {
			"orientation" : [ "landscape-primary" ],
		}
	}
```

* App.vue中onLaunch方法里面移除以下代码

```javascript
	onLaunch: function() {
		// #ifdef APP-PLUS
		plus.screen.lockOrientation('landscape-primary'); //锁定横屏
		plus.navigator.setFullscreen(true); //隐藏状态栏(应用全屏:只能隐藏状态栏，标题栏和虚拟返回键都还可以显示)		
		// #endif
	}
```