<template>
    <div id="feedback-form-wrapper">
        <div id="floating-icon">
            <button type="button" class="btn btn-primary btn-sm rounded-0" data-toggle="modal"
                data-target="#adminFeedbackModal">
                Provide Feedback
            </button>
        </div>
        <div id="feedback-form-modal">
            <div class="modal fade" id="adminFeedbackModal" tabindex="-1" aria-labelledby="adminFeedbackLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="adminFeedbackLabel">Feedback Form</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" style="color: red;">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="adminRating">How satisfied you are with our app?</label>
                                    <div class="rating-input-wrapper d-flex justify-content-between mt-2">
                                        <label><input type="radio" name="adminRating" /><span
                                                class="border rounded px-3 py-2">1</span></label>
                                        <label><input type="radio" name="adminRating" /><span
                                                class="border rounded px-3 py-2">2</span></label>
                                        <label><input type="radio" name="adminRating" /><span
                                                class="border rounded px-3 py-2">3</span></label>
                                        <label><input type="radio" name="adminRating" /><span
                                                class="border rounded px-3 py-2">4</span></label>
                                        <label><input type="radio" name="adminRating" /><span
                                                class="border rounded px-3 py-2">5</span></label>
                                    </div>
                                    <div class="rating-labels d-flex justify-content-between mt-1">
                                        <label>Not Satisfied</label>
                                        <label>Very Satisfied</label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="adminFeedback">Please share your comments or suggestions for
                                        improvement:</label>
                                    <textarea class="form-control" id="adminFeedback" rows="3"
                                        placeholder="Your feedback..."></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Submit Feedback</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#feedback-form-wrapper #floating-icon>button {
    position: fixed;
    right: 0;
    top: 50%;
    transform: rotate(-90deg) translate(50%, -50%);
    transform-origin: right;
}

#feedback-form-wrapper .rating-input-wrapper input[type="radio"] {
    display: none;
}

#feedback-form-wrapper .rating-input-wrapper input[type="radio"]~span {
    cursor: pointer;
}

#feedback-form-wrapper .rating-input-wrapper input[type="radio"]:checked~span {
    background-color: #4261dc;
    color: #fff;
}

#feedback-form-wrapper .rating-labels>label {
    font-size: 14px;
    color: #777;
}

.modal-content {
    background-color: #353434;
    color: #fff;
}

.modal-body {
    color: #fff;
}
</style>