const SAVE_BUTTON_TEST_ID_SELECTOR = '[data-testid="comment-save-button"]';
const COMMENT_BOX_TEST_ID_SELECTOR= '[data-testid="issue.activity.comment"]';
const TEXT_AREA_SELECTOR = '#ak-editor-textarea'
const PORTAL_CONTAINER_SELECTOR = '.atlaskit-portal-container'

function getCancelButton() {
    return document.querySelector(`${SAVE_BUTTON_TEST_ID_SELECTOR} + button`);
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
    const saveButton = document.querySelector(SAVE_BUTTON_TEST_ID_SELECTOR);
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

    const commentBox = document.querySelector(COMMENT_BOX_TEST_ID_SELECTOR)
    const editableBox = commentBox.querySelector(TEXT_AREA_SELECTOR);

    if (editableBox && !window.hasEditableBoxListener) {

        editableBox.addEventListener('keydown', () => {
            window.hasCommentContent = true;
        })

        window.hasEditableBoxListener = true;
    }

    saveButtonListener();
}

function registerCommentBoxListener() {
    const commentBox = document.querySelector(COMMENT_BOX_TEST_ID_SELECTOR);

    if (commentBox && !window.hasCommentBoxMutationHandler) {
        const commentBoxMutationObserver = new MutationObserver(registerCancelButtonListener)

        commentBoxMutationObserver.observe(commentBox, {childList: true, subtree: true})
        window.hasCommentBoxMutationHandler = true;
    }
}

function registerPortalContainerMutationHandler() {
    const portalContainer = document.querySelector(PORTAL_CONTAINER_SELECTOR);

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
