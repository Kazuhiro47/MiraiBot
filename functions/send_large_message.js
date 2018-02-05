module.exports = {

    send_large_message: function (message, data, code=false) {

        if (data.length < 1000) {
            if (code) {
                if (!data.startsWith("```")) {
                    data = "```js\n" + data;
                }
                if (!data.endsWith("```")) {
                    data += "\n```";
                }
            }
            message.channel.send(data).catch(console.error);
        } else {

            let end = data.length;
            let read = 0;
            let new_data = data;
            let subdatalen = 0;

            function send_messages(index) {
                let subdata;
                if (new_data.length > 1000)
                    subdata = new_data.substr(index, 1000);
                else
                    subdata = new_data.substring(index, new_data.length - 1);
                new_data = data.substring(index + 1000);
                subdatalen = subdata.length;
                if (code) {
                    if (!subdata.startsWith("```")) {
                        subdata = "```js\n" + subdata;
                    }
                    if (!subdata.endsWith("```")) {
                        subdata += "\n```";
                    }
                }
                message.channel.send(subdata).then(msg => {
                    read += subdatalen;
                    if (read < end)
                        return send_messages(index + 1000);
                });
            }
            send_messages(0);
        }

    }

};