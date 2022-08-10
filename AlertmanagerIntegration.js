class Script {
    process_incoming_request({ request }) {
        var alertColor = "warning";
        if (request.content.status == "resolved") {
            alertColor = "good";
        } else if (request.content.status == "firing") {
            alertColor = "danger";
        }

        var content_text = "";
        let alertFields = [];

        for (const alert of request.content.alerts){
            var elem = {
                title: "alertname: " + alert.labels.alertname,
                value: alert.annotations.message,
                short: false
            };
            alertFields.push(elem);
        }

        //var footer = {
        //    title: "Full Content:",
        //    value: '```\n'+JSON.stringify(request.content, null, 2)+'\n```',
        //    short: false
        //};
        //alertFields.push(footer);

        return {
            content: {
                emoji: ":ghost:",
                text: "Prometheus notification: " + request.content.status,
                attachments: [
                    {
                        "title": request.content.commonAnnotations.message,
                        "title_link": request.content.externalURL,
                        "text": content_text,
                        "fields": alertFields,
                        "color": alertColor
                    },
                    {
                        "title": "Full Content",
                        "text": '```json\n'+JSON.stringify(request.content, null, 2)+'\n```'
                    }
                ]
            }
        };
    }
}
