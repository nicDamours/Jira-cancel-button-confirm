function getCancelButton() {
    return document.querySelector('[data-testid="comment-save-button"] + button');
}

/**
 * @param {Event} ev
 * @returns {boolean}
 */
function promptHandler(ev) {
    if ('hasCommentContent' in window && window.hasCommentContent) {
        ev.preventDefault();

        const response = confirm('Are you sure you want to cancel? You will loose your data.')

        if (!response) {
            ev.stopImmediatePropagation();
            ev.stopPropagation();
            return false;
        }

        window.hasCommentContent = false;
    }

    window.hasCancelButtonListener = false;
    window.hasEditableBoxListener = false;
    return true;
}

function handleSaveButtonClick() {
    window.hasCommentContent = false;
    window.hasCancelButtonListener = false;
    window.hasEditableBoxListener = false;
}

function saveButtonListener() {
    const saveButton = document.querySelector('[data-testid="comment-save-button"]');
    if(saveButton) {
        saveButton.addEventListener('click', handleSaveButtonClick)
    }
}


function registerCancelButtonListener() {
    const cancelButton = getCancelButton();

    // if the button already exists, we add the listener on it.
    if (cancelButton && !window.hasCancelButtonListener) {
        window.hasCancelButtonListener = true;
        cancelButton.addEventListener('click', promptHandler)
    }

    const commentBox = document.querySelector('[data-testid="issue.activity.comment"]')
    const editableBox = commentBox.querySelector('#ak-editor-textarea');

    if (editableBox && !window.hasEditableBoxListener) {

        editableBox.addEventListener('keydown', () => {
            window.hasCommentContent = true;
        })

        window.hasEditableBoxListener = true;
    }

    saveButtonListener();
}

function registerCommentBoxListener() {
    const commentBox = document.querySelector('[data-testid="issue.activity.comment"]');

    if (commentBox && !window.hasCommentBoxMutationHandler) {
        const commentBoxMutationObserver = new MutationObserver(registerCancelButtonListener)

        commentBoxMutationObserver.observe(commentBox, {childList: true, subtree: true})
        window.hasCommentBoxMutationHandler = true;
    }
}

function registerPortalContainerMutationHandler() {
    const portalContainer = document.querySelector('.atlaskit-portal-container');

    if (portalContainer && !window.hasPortalContainerMutationHandler) {
        const commentBoxMutationObserver = new MutationObserver(registerCommentBoxListener)

        commentBoxMutationObserver.observe(portalContainer, {childList: true, subtree: true})
        window.hasPortalContainerMutationHandler = true;
    }
}


function registerListeners() {
    window.hasCancelButtonListener = false;
    window.hasEditableBoxListener = false;
    window.hasCommentBoxMutationHandler = false;
    window.hasPortalContainerMutationHandler = false;

    registerCancelButtonListener();

    registerCommentBoxListener();

    registerPortalContainerMutationHandler();
}

(function () {
    setTimeout(registerListeners, 5000);
})()
