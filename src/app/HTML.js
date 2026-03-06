export default ({title="", meta="", links="", content="", initialState={}, env={}, base_path="" }) => `
<html lang='en'>
    <head>
        <meta charset="utf-8">
				<title>eCademy app of all things school</title>
				<!-- link rel="manifest" href="/manifest.json" -->
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
        ${meta}
        ${links}
	<link rel="shortcut icon" href="#" />
	<link rel="icon" href="data:;base64,iVBORw0KGgo=">
        <link href='${base_path}/static/app.css?version=4.0.073' type="text/css" rel="stylesheet">
        <link href="${base_path}/static/react-hint.css" type="text/css" rel="stylesheet">
        <link href="${base_path}/static/dropzone.min.css" type="text/css" rel="stylesheet">
        <link href="${base_path}/static/react-hint.css" type="text/css" rel="stylesheet">
        <link href="${base_path}/static/ReactContexify.min.css" type="text/css" rel="stylesheet">
        <link href="${base_path}/static/react-virtualized.css" type="text/css" rel="stylesheet">
        <link href="${base_path}/static/rc-time-picker.css" type="text/css" rel="stylesheet">
				<link href="${base_path}/static/react-big-calendar.css" type="text/css" rel="stylesheet">
				<link href="${base_path}/static/ReactCrop.css" type="text/css" rel="stylesheet">
        <link href="${base_path}/static/rc-slider.css" type="text/css" rel="stylesheet">
        <link href="${base_path}/static/react-datetime.css" type="text/css" rel="stylesheet">
        
<!--        <link href="static/dropzone.min.css" type="text/css">-->
<!--        <link href="static/react-hint.css" type="text/css">-->
<!--        <link href="static/ReactContexify.min.css" type="text/css">-->
<!--        <link href="static/react-virtualized.css" type="text/css">-->
<!--        <link href="static/rc-time-picker.css" type="text/css">-->
<!--				<link href="static/react-big-calendar.css" type="text/css">-->
<!--				<link href="static/ReactCrop.css" type="text/css">-->
<!--        <link href="static/rc-slider.css" type="text/css">-->
<!--        <link href="static/react-datetime.css" type="text/css">-->

<!--        <link href="dropzone.min.css" type="text/css">-->
<!--        <link href="react-hint.css" type="text/css">-->
<!--        <link href="ReactContexify.min.css" type="text/css">-->
<!--        <link href="react-virtualized.css" type="text/css">-->
<!--        <link href="rc-time-picker.css" type="text/css">-->
<!--				<link href="react-big-calendar.css" type="text/css">-->
<!--				<link href="ReactCrop.css" type="text/css">-->
<!--        <link href="rc-slider.css" type="text/css">-->
<!--        <link href="react-datetime.css" type="text/css">-->
        <!-- link href="${base_path}/static/react-virtualized.css" type="text/css" -->
        <!-- link href="${base_path}/static/react-sortable-tree.css" type="text/css" -->

<!--				<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">-->
				<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <script src='https://www.google.com/recaptcha/api.js' async defer></script>
    </head>
    <body style="height: 95%">
        <div id=app>${content}</div>
<!--        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=fetch&unknown=polyfill"></script> -->
        <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
            window.__APP_ENV_VARS__ = ${JSON.stringify(env)};
        </script>
        <script type=text/javascript src='${base_path}/static/app.js?version=4.0.073' charset=utf-8 async></script>
				<script>
				// if('serviceWorker' in navigator) {
				//   navigator.serviceWorker
				//            .register('/sw.js')
				//            //.then(function() { console . log("Service Worker Registered"); });
				// }
				</script>
    </body>
</html>
`;
