
var sb;

/**
 * https://sendbird.com/docs/chat/v3/javascript/getting-started/send-first-message#2-step-2-connect-to-sendbird-server
 */
function connect() {

    const appId = document.getElementById('appId').value;
    const userId = document.getElementById('userId').value;

    sb = new SendBird({ appId });

    sb.connect(userId, (user, error) => {
        if (error) {
            alert(error);
        } else {
            console.log('Connected');
            setHandlers();
        }
    });
}

/**
 * https://sendbird.com/docs/chat/v3/javascript/guides/event-handler
 */
function setHandlers() {
    
    var channelHandler = new sb.ChannelHandler();

    channelHandler.onMessageReceived = (channel, message) => {        
        
        console.log(`New message received`);

        if (message.message == 'METADATA-ADDED-TO-USER') {
            console.log('DO NOT SHOW THIS MESSAGE ON THE LIST.');
            console.log('IT MEANS A NEW METADATA WAS ADDED TO A USER');
            console.log('METADATA ADDED TO USER IS: '); 
            console.dir( JSON.parse( message.data ) ); // Convert from String to JSON
        }
        console.dir(message);
    };
    
    sb.addChannelHandler('ANY-IDENTIFIER-HERE-' + new Date().getTime(), channelHandler);
    
    console.log('Handlers set.');
}


/**
 * https://sendbird.com/docs/chat/v3/javascript/guides/user-and-channel-metadata#2-user-metadata
 */
function createUserMetadataAndInform() {

    const data = {
        'key-1': 'Any value'
    };
        
    var user = sb.currentUser;
    user.createMetaData(data, function(metadata, error) {
        if (error) {
            alert('Error creating user metadata!')
        } else {
            informMetadataWasCreatedForUser(data);
        }
    });

}

/**
 * Update channel metadata
 * https://sendbird.com/docs/chat/v3/javascript/guides/user-and-channel-metadata#2-channel-metadata
 */
function informMetadataWasCreatedForUser(data) {

    const channelUrl = document.getElementById('groupChannelUrl').value;

    const userId = document.getElementById('userId').value;

    sb.GroupChannel.getChannel(channelUrl, (groupChannel, error) => {
    
        const params = new sb.UserMessageParams();

        params.message = 'METADATA-ADDED-TO-USER';
        params.customType = userId;
        params.data = JSON.stringify( data ); // Convert from JSON to String

        groupChannel.sendUserMessage(params, function(userMessage, error) {
            if (error) {
                alert('Error sending metadata!')
            } else {
                console.log('Metadata sent.');
            }
        });  

    })
}
