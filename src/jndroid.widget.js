/**
 * Layout container for a view hierarchy that can be scrolled by the user,
 * allowing it to be larger than the physical display.  A child that is often used
 * is a LinearLayout in a vertical orientation, presenting a vertical
 * array of top-level items that the user can scroll through.
 *
 * ScrollView only supports vertical scrolling. For horizontal scrolling,
 * use HorizontalScrollView.
 *
 * @class ScrollView
 */
function ScrollView() {
    ViewGroup.apply(this, []);

    this.setStyle("overflow", "auto");

    this.onMeasure = function(widthMS, heightMS) {
        var width = MeasureSpec.getSize(widthMS);
        var height = MeasureSpec.getSize(heightMS);
        if (this.getChildCount() > 0) {
            var child = this.getChildAt(0);
            var contentWidth = width - this.getPaddingLeft() - this.getPaddingRight();
            child.measure(contentWidth, height);
        }
        this.setMeasuredDimension(width, height);
    };

    this.onLayout = function(x, y) {
        var offsetX = this.getPaddingLeft();
        var offsetY = this.getPaddingTop();
        if (this.getChildCount() > 0) {
            var child = this.getChildAt(0);
            child.layout(offsetX, offsetY);
        }
    };
}

/**
 * Layout container for a view hierarchy that can be scrolled by the user,
 * allowing it to be larger than the physical display.  A child that is often used
 * is a LinearLayout in a horizontal orientation, presenting a horizontal
 * array of top-level items that the user can scroll through.
 *
 * HorizontalScrollView only supports horizontal scrolling. For vertical scrolling,
 * use ScrollView.
 *
 * @class HorizontalScrollView
 */
function HorizontalScrollView() {
    ViewGroup.apply(this, []);

    this.setStyle("overflow", "auto");

        this.scrollTo = function(x) {
        this.getDiv().scrollLeft = x;
        console.log("this.getDiv().scrollLeft:" + this.getDiv().scrollLeft);
    };

    this.onMeasure = function(widthMS, heightMS) {
        var width = MeasureSpec.getSize(widthMS);
        var height = MeasureSpec.getSize(heightMS);
        if (this.getChildCount() > 0) {
            var child = this.getChildAt(0);
            var contentHeight = height - this.getPaddingTop() - this.getPaddingBottom();
            child.measure(width, contentHeight);
        }
        this.setMeasuredDimension(width, height);
    };

    this.onLayout = function(x, y) {
        var offsetX = this.getPaddingLeft();
        var offsetY = this.getPaddingTop();
        if (this.getChildCount() > 0) {
            var child = this.getChildAt(0);
            child.layout(offsetX, offsetY);
        }
    };
}

/**
 * Displays an arbitrary icon.The ImageView class provides scaling display options.
 *
 * @class ImageView
 */
function ImageView() {
    ViewGroup.apply(this, []);

    var mSelf = this;
    var mSrc = null;
    var mImg = null;
    var mScaleType = ScaleType.CENTER;
    var mCustomWidth = 0;
    var mCustomHeight = 0;
    var scaleTimeout = 0;

    /**
     * Set the scale type of image.
     *
     * @method setScaleType
     * @param {int} ScaleType.CENTER,ScaleType.FIT_XY,ScaleType.CENTER_INSIDE,ScaleType.FIT_CENTER or ScaleType.CENTER_CROP.
     */
    this.setScaleType = function(st) {
        mScaleType = st;
    };

    /**
     * Sets the content of this ImageView to the specified Uri.
     *
     * @method setImageUri
     * @param {string} The Uri of an image
     */
    this.setImageUri = function(src) {
        this.setImgSrc(src);
    };

    this.setImgSrc = function(src) {
        this.setVisibility(View.VISIBLE);
        mSrc = src;

        if (mImg == null) {
            mImg = document.createElement("img");
        }
        mImg.src = src;
        mImg.style.verticalAlign = "middle";
        mImg.style.position = "absolute";
        mImg.style.top = 0;
        mImg.style.left = 0;
        mImg.onerror = function() {
            mSelf.setVisibility(View.INVISIBLE);
        };
        this.getDiv().appendChild(mImg);
        this.requestLayout();
    };

    this.setStyleWidth = function(w) {
        mImg.style.width = w + "px";
        mImg.style.left = (this.getMeasuredWidth() - w) / 2 + "px";
    };

    this.setStyleHeight = function(h) {
        mImg.style.height = h + "px";
        mImg.style.top = (this.getMeasuredHeight() - h) / 2 + "px";
    };

    this.setImgWidth = function(width) {
        this.setStyleWidth(width);
        mCustomWidth = width;
    };

    this.setImgHeight = function(height) {
        this.setStyleHeight(height);
        mCustomHeight = height;
    };

    this.onMeasure = function (widthMS, heightMS) {
        var width = MeasureSpec.getSize(widthMS);
        var height = MeasureSpec.getSize(heightMS);
        this.getDiv().style.lineHeight = height + "px";

        this.setMeasuredDimension(width, height);

        this.scale();
    };

    this.scale = function() {
        if (mImg != null) {
            var nw = mImg.naturalWidth;
            var nh = mImg.naturalHeight;
            if (nw == 0 || nh == 0) {
                scaleTimeout = setTimeout(this.scale, 200);
                mImg.onload = mSelf.scaleInner;
                mSelf.setStyleWidth(mSelf.getMeasuredWidth());
            } else {
                clearTimeout(scaleTimeout);
                mSelf.scaleInner();
            }
        }
    };

    this.scaleInner = function() {
        var nw = mImg.naturalWidth;
        var nh = mImg.naturalHeight;
        var width = mSelf.getWidth();
        var height = mSelf.getHeight();
        if (mCustomWidth != 0) {
            var h = mCustomWidth * nh / nw;
            mSelf.setStyleWidth(mCustomWidth);
            mSelf.setStyleHeight(h);
        } else if (mCustomHeight != 0) {
            var w = mCustomHeight * nw / nh;
            mSelf.setStyleWidth(w);
            mSelf.setStyleHeight(mCustomHeight);
        } else if (mScaleType == ScaleType.CENTER) {
            mSelf.setStyleWidth(nw);
            mSelf.setStyleHeight(nh);
        } else if (mScaleType == ScaleType.FIT_XY) {
            mSelf.setStyleWidth(width);
            mSelf.setStyleHeight(height);
        } else if (mScaleType == ScaleType.CENTER_INSIDE) {
            if (nw > width || nh > height) {
                mSelf.fitCenter(nw, nh, width, height);
            }
        } else if (mScaleType == ScaleType.FIT_CENTER) {
            mSelf.fitCenter(nw, nh, width, height);
        } else if (mScaleType == ScaleType.CENTER_CROP) {
            mSelf.cropCenter(nw, nh, width, height);
        }
    };

    this.fitCenter = function(nw, nh, width, height) {
        if (nw / nh > width / height) {
            this.setStyleWidth(width);
            this.setStyleHeight(width * nh / nw);
        } else {
            this.setStyleWidth(height * nw / nh);
            this.setStyleHeight(height);
        }
    };

    this.cropCenter = function(nw, nh, width, height) {
        if (nw / nh < width / height) {
            this.setStyleWidth(width);
            this.setStyleHeight(width * nh / nw);
        } else {
            this.setStyleWidth(height * nw / nh);
            this.setStyleHeight(height);
        }
    };
}

function ScaleType(){}
Object.defineProperty(ScaleType,"FIT_XY",{value:1});
Object.defineProperty(ScaleType,"FIT_CENTER",{value:3});
Object.defineProperty(ScaleType,"CENTER",{value:5});
Object.defineProperty(ScaleType,"CENTER_CROP",{value:6});
Object.defineProperty(ScaleType,"CENTER_INSIDE",{value:7});

/**
 * Displays a button with an image (instead of text) that can be pressed
 * or clicked by the user.
 *
 * @class ImageButton
 */
function ImageButton() {
    ImageView.apply(this, []);
}

/**
 * Displays text to the user and not allows editing.
 *
 * @class TextView
 */
function TextView() {
    ViewGroup.apply(this, []);

    var mGravity = 0;
    var mTextSize = 12;
    var mSingleLine = false;
    var mContent = document.createElement("div");
    mContent.style.overflow = "auto";
    mContent.style.whiteSpace = "normal";
    this.getDiv().appendChild(mContent);

    /**
     * Return the text that TextView is displaying.
     *
     * @method getText
     * @return {string} The text in the TextView.
     */
    this.getText = function() {
        return mContent.innerHTML;
    };

    /**
     * Sets the string value of the TextView.
     *
     * @method setText
     * @param {string} text Sets the string value.
     */
    this.setText = function(text) {
        mContent.innerHTML = text;

        this.requestLayout();
        this.getDiv().scrollTop = "100px";
    };

    /**
     * Sets whether the content of this view is selectable by the user.
     *
     * @method setTextIsSelectable
     * @param {boolean} selectable Whether the content of this TextView should be selectable.
     */
    this.setTextIsSelectable = function(selectable) {
        if (selectable) {
            mContent.style["-webkit-user-select"] = "text";
        } else {
            mContent.style["-webkit-user-select"] = "none";
        }
    };

    /**
     * Sets the text color.
     *
     * @method setTextColor
     * @param {int} color The text color.
     */
    this.setTextColor = function(color) {
        mContent.style.color = Utils.toCssColor(color);
    };

    /**
     * Set the default text size to the given value.
     *
     * @method setTextSize
     * @param {int} textsize The default text size.
     */
    this.setTextSize = function(textsize) {
        mTextSize = textsize;
        mContent.style.fontSize = textsize + "px";
    };

    /**
     * Gives the text a shadow of the specified blur radius and color, the specified
     * distance from its drawn position.
     *
     * @method setShadowLayer
     * @param {int} radius If radius is 0, then the shadow layer is removed.
     * @param {int} dx Specified offset of X.
     * @param {int} dy Specified offset of Y.
     * @param {int} color Specified color.
     */
    this.setShadowLayer = function(radius, dx, dy, color) {
        mContent.style.textShadow = dx + "px " + dy + "px " + radius + "px " + Utils.toCssColor(color);
    };

    /**
     * Set the line height.
     *
     * @method setLineHeight
     * @param {int} lineHeight the line height.
     */
    this.setLineHeight = function(lineHeight) {
        mContent.style.lineHeight = lineHeight + "px";
    };

    /**
     * Sets whether the line is single.
     *
     * @method setSingleLine
     * @param {boolean} singleLine Whether the line is single.
     */
    this.setSingleLine = function(singleLine) {
        mSingleLine = singleLine;
        if (mSingleLine) {
            mContent.style.whiteSpace = "nowrap";
        } else {
            mContent.style.whiteSpace = "normal";
        }
        this.requestLayout();
    };

    this.onMeasure = function(widthMS, heightMS) {
        var width = MeasureSpec.getSize(widthMS);
        var height = MeasureSpec.getSize(heightMS);
        var mode = MeasureSpec.getMode(heightMS);

        mContent.style.width = (width - this.getPaddingLeft() - this.getPaddingRight()) + "px";
        mContent.style.height = "100%";
        mContent.style.left = this.getPaddingLeft() + "px";

        var measureDiv = document.createElement("div");
        measureDiv.style.width = mContent.style.width;
        measureDiv.style.height = "100%";
        measureDiv.style.fontFamily = Utils.findFontFamily(mContent);
        measureDiv.style.lineHeight = mContent.style.lineHeight;
        measureDiv.style.fontSize = mContent.style.fontSize;
        measureDiv.style.whiteSpace = mContent.style.whiteSpace;
        measureDiv.innerHTML = mContent.innerHTML;
        mHideDiv.appendChild(measureDiv);

        if (measureDiv.clientHeight !== 0) {
            var measureHeight = measureDiv.clientHeight;
            if (mode == MeasureSpec.UNSPECIFIED) {
                height = measureHeight;
            } else {
                if (mode != MeasureSpec.EXACTLY && height < measureHeight) {
                    height = measureHeight;
                } else {
                    if (height > measureHeight) {
                        mContent.style.clientHeight = measureHeight + "px";
                        mContent.style.height = "auto";
                        mContent.style.position = "absolute";
                        if (mGravity & Gravity.CENTER_VERTICAL) {
                            mContent.style.top = (height - measureHeight) / 2 + "px";
                        } else if (mGravity & Gravity.BOTTOM) {
                            mContent.style.top = (height - measureHeight) + "px";
                        } else {
                            mContent.style.top = 0 + "px";
                        }
                    }
                }
            }
        }
        mHideDiv.removeChild(measureDiv);

        mHideDiv.style.width = "auto";
        mHideDiv.style.height = "auto";

        this.setMeasuredDimension(width, height);

    };

    /**
     * Sets the horizontal alignment of the text and the
     * vertical gravity that will be used when there is extra space
     * in the TextView beyond what is required for the text itself.
     *
     * @method setGravity
     * @param {int} gravity
     */
    this.setGravity = function(gravity) {
        mGravity = gravity;

        if (gravity & Gravity.CENTER_HORIZONTAL) {
            this.getDiv().style.textAlign = "center";
        } else if (gravity & Gravity.RIGHT) {
            this.getDiv().style.textAlign = "right";
        } else {
            this.getDiv().style.textAlign = "left";
        }

    };
}

/**
 * Represents a push-button widget.Push-buttons can be
 * pressed, or clicked, by the user to perform an action.
 *
 * @class Button
 */
function Button() {
    TextView.apply(this, []);

    var mPressBg = 0x1a000000;
    var mNormalBg = 0;

    this.setGravity(Gravity.CENTER);
    this.setBorder(1, 0x1a000000);

    this.setPressBg = function(c) {
        mPressBg = c;
    };

    this.onTouchEvent = function(e) {
        switch (e.getAction()) {
            case MotionEvent.ACTION_DOWN:
                mNormalBg = this.setBackgroundColor();
                this.setBackgroundColor(mPressBg);
                break;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                this.setBackgroundColor(mNormalBg);
                break;
        }
    };
}

/**
 * EditText is a thin veneer over TextView that configures itself
 * to be editable.
 *
 * @class EditText
 */
function EditText() {
    ViewGroup.apply(this, []);

    var mTag = "EditText" + (new Date()).getTime();

    var mSelf = this;
    var mFocusListener = null;
    var mInput;
    var mTextSize = 12;
    var mIsPassword = false;
    var mTextListener = null;

    this.setDisabled = function(disabled) {
        if (disabled) {
            mInput.disabled = "disabled";
        } else {
            mInput.disabled = "";
        }
    };

    /**
     * Sets whether the text of this EditText is password.
     *
     * @method setPassword
     * @param {boolean} isPassword
     */
    this.setPassword = function(isPassword) {
        mIsPassword = isPassword;
        mInput.type = "password";
    };

    this.getInput = function() {
        return mInput;
    };

    this.addInput = function() {
        this.getDiv().innerHTML = "";
        mInput = document.createElement("input");
        initInput();
        this.getDiv().appendChild(mInput);
    };
    this.addInput();

    this.addTextArea = function() {
        this.getDiv().innerHTML = "";
        mInput = document.createElement("textarea");
        initInput();
        this.getDiv().appendChild(mInput);
    };

    this.setOnFocusChangeListener = function(l) {
        mFocusListener = l;
    };

    this.onFocusChanged = function(focused) {
        if (mFocusListener != null) {
            mFocusListener.call(this, focused);
        }
    };

    this.setSingleLine = function(s) {
        if (s) {
            this.addInput();
        } else {
            this.addTextArea();
        }
    };

    /**
     * Set the selection anchor to start and the selection edge to end.
     *
     * @method setSelection
     * @param {int} start Selection anchor to start.
     * @param {int} end Selection anchor to end.
     */
    this.setSelection = function(start, end) {
        mInput.selectionStart = start;
        if (end == undefined) {
            mInput.selectionEnd = start;
        } else {
            mInput.selectionEnd = end;
        }
    };

    /**
     * Return the offset of the selection anchor or cursor.
     *
     * @method getSelectionStart
     * @return {int} The offset.
     */
    this.getSelectionStart = function() {
        return mInput.selectionStart;
    };

    /**
     * Return the offset of the selection edge or cursor.
     *
     * @method getSelectionEnd
     * @return {int} The offset.
     */
    this.getSelectionEnd = function() {
        return mInput.selectionEnd;
    };

    /**
     * set a listener to whose methods are called whenever this EditText's text changes.
     *
     * @method setTextChangedListener
     * @param listener.
     */
    this.setTextChangedListener = function(listener) {
        mTextListener = listener;
        mInput.oninput = listener;
    };

    /**
     * Return the text that EditText is displaying.
     *
     * @method getText
     * @return {string} The text in the EditText.
     */
    this.getText = function() {
        return mInput.value;
    };

    /**
     * Sets the string value of the EditText.
     *
     * @method setText
     * @param {string} text Sets the string value.
     */
    this.setText = function(text) {
        mInput.value = text;
    };

    /**
     * Sets the text size of the EditText.
     *
     * @method setTextSize
     * @param {int} size Sets the text size.
     */
    this.setTextSize = function(size) {
        mTextSize = size;
        mInput.style.fontSize = size + "px";
    };

    /**
     * Sets the text color of the EditText.
     *
     * @method setTextColor
     * @param {int} color Sets the text color.
     */
    this.setTextColor = function(color) {
        mInput.style.color = Utils.toCssColor(color);
    };

    /**
     * Sets the text to be displayed when the text of the EditText is empty.
     *
     * @method setHint
     * @param {string} text Sets the hint text.
     */
    this.setHint = function(text) {
        this.setHintText(text);
    };

    this.setHintText = function(text) {
        mInput.placeholder = text;
    };

    /**
     * Sets the color of the hint text for this EditText.
     *
     * @method setHintColor
     * @param {int} color Sets the hint text's color.
     */
    this.setHintColor = function(color) {
        var css = document.createElement("style");
        css.innerHTML = "." + mTag + "::-webkit-input-placeholder{ color:" + Utils.toCssColor(color) + "}";
        document.head.appendChild(css);
        mInput.className += mTag + " ";
    };

    /**
     * To get this EditText to take focus.
     *
     * @method requestFocus
     */
    this.requestFocus = function() {
        mInput.focus();
    };

    this.onMeasure = function(widthMS, heightMS) {
        var width = MeasureSpec.getSize(widthMS);
        var height = MeasureSpec.getSize(heightMS);
        var hMode = MeasureSpec.getMode(heightMS);

        var contentWidth = width - this.getPaddingLeft() - this.getPaddingRight();
        var contentHeight = height - this.getPaddingTop() - this.getPaddingBottom();
        if (hMode != MeasureSpec.EXACTLY) {
            contentHeight = mTextSize * 1.5;
            height = contentHeight + this.getPaddingTop() + this.getPaddingBottom();
        }
        mInput.style.fontFamily = Utils.findFontFamily(mInput);
        mInput.style.width = contentWidth + "px";
        mInput.style.height = contentHeight + "px";

        this.setMeasuredDimension(width, height);
    };

    this.onLayout = function(x, y) {
        mInput.style.top = this.getPaddingTop() + "px";
        mInput.style.left = this.getPaddingLeft() + "px";
    };

    function initInput() {
        if (mIsPassword) {
            mInput.type = "password";
        } else {
            mInput.type = "text";
        }
        mInput.style.boxSizing = "border-box";
        mInput.style.position = "absolute";
        mInput.style.background = "none";
        mInput.style.border = "0";
        mInput.style.outline = "none";
        mInput.style.padding = 0;
        mInput.style.fontSize = mTextSize;
        mInput.onfocus = function() {
            mSelf.onFocusChanged(true);
        };
        mInput.onblur = function() {
            mSelf.onFocusChanged(false);
        };
        if (mTextListener != null) {
            mInput.oninput = mTextListener;
        }
    }
}

/**
 * @class WebView
 */
function WebView() {
    ViewGroup.apply(this, []);

    this.setBackgroundColor("#ffffff");

    var mFrame = document.createElement("iframe");
    mFrame.style.border = "none";
    this.getDiv().appendChild(mFrame);

    this.loadUrl = function(url) {
        mFrame.src = url;
    };

    this.loadData = function(data) {
        mFrame.srcdoc = data;
    };

    this.loadDataWithBaseURL = function(data) {
        mFrame.srcdoc = data;
    };

    this.setSrc = function(src){
        mFrame.src = src;
    };

    this.setSrcDoc = function(srcdoc) {
        mFrame.srcdoc = srcdoc;
    };

    this.getFrame = function() {
        return mFrame;
    };

    this.onMeasure = function(widthMS, heightMS) {
        var width = MeasureSpec.getSize(widthMS);
        var height = MeasureSpec.getSize(heightMS);
        mFrame.style.width = width + "px";
        mFrame.style.height = height + "px";
        this.setMeasuredDimension(width, height);
    };
}
