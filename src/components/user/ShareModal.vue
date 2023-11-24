<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content col-12">
            <div class="modal-header">
                <h5 class="modal-title text-dark">Share</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="icon-container1 d-flex">
                    <div class="smd">
                        <i class=" img-thumbnail fab fa-twitter fa-2x"
                            style="color:#4c6ef5;background-color: aliceblue"></i>
                        <p>Twitter</p>
                    </div>
                    <div class="smd">
                        <i class="img-thumbnail fab fa-facebook fa-2x"
                            style="color: #3b5998;background-color: #eceff5;"></i>
                        <p>Facebook</p>
                    </div>
                    <div class="smd">
                        <i class="img-thumbnail fab fa-reddit-alien fa-2x"
                            style="color: #FF5700;background-color: #fdd9ce;"></i>
                        <p>Reddit</p>
                    </div>
                    <div class="smd">
                        <i class="img-thumbnail fab fa-discord fa-2x "
                            style="color: #738ADB;background-color: #d8d8d8;"></i>
                        <p>Discord</p>
                    </div>
                </div>
                <div class="icon-container2 d-flex">
                    <div class="smd">
                        <i class="img-thumbnail fab fa-whatsapp fa-2x"
                            style="color:  #25D366;background-color: #cef5dc;"></i>
                        <p>Whatsapp</p>
                    </div>
                    <div class="smd">
                        <i class="img-thumbnail fab fa-facebook-messenger fa-2x"
                            style="color: #3b5998;background-color: #eceff5;"></i>
                        <p>Messenger</p>
                    </div>
                    <div class="smd">
                        <i class="img-thumbnail fab fa-telegram fa-2x"
                            style="color:  #4c6ef5;background-color: aliceblue"></i>
                        <p>Telegram</p>
                    </div>
                    <div class="smd">
                        <i class="img-thumbnail fab fa-weixin fa-2x" style="color: #7bb32e;background-color: #daf1bc;"></i>
                        <p>WeChat</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer text-dark">
                <label style="font-weight: 600">Page Link <span class="message"></span></label><br />
                <div class="row">
                    <input class="col-10 ur" type="url" placeholder="http://localhost:8080/" id="myInput"
                        aria-describedby="inputGroup-sizing-default" style="height: 40px;">
                    <button class="col-2" @click="$emit('shareLinkCopy')"><i class="far fa-clone"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ShareModal",
}
</script>

<style>
.modal-title {
    font-weight: 900;
}

.modal-content {
    border-radius: 13px;
}

.modal-body {
    color: #3b3b3b;
}

.img-thumbnail {
    border-radius: 33px;
    width: 61px;
    height: 61px;
}

.fab:before {
    position: relative;
    top: 13px;
}

.smd {
    width: 200px;
    font-size: small;
    text-align: center;
}

.modal-footer {
    display: block;
}

.ur {
    border: none;
    background-color: #e6e2e2;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
}

.cpy {
    border: none;
    background-color: #e6e2e2;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    cursor: pointer;
}

button.focus,
button:focus {
    outline: 0;
    box-shadow: none !important;

}

.ur.focus,
.ur:focus {
    outline: 0;
    box-shadow: none !important;
}

.message {
    font-size: 11px;
    color: #ee5535;
}
</style>