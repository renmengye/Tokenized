var SizeOption = (function () {
    function SizeOption(width, height) {
        this.width = width;
        this.height = height;
    }
    return SizeOption;
})();
var Bahen;
(function (Bahen) {
    (function (Web) {
        var UserTokenizedElement = (function () {
            function UserTokenizedElement(placeholder, name, email) {
                this.placeholder = placeholder;
                this.name = name;
                this.email = email;
                $(this.placeholder).addClass("token unselectable");
                $(this.placeholder).append(this.getHtml());
                $(this.placeholder).click(function () {
                    if($(this.placeholder).hasClass("selected")) {
                        $(this.placeholder).removeClass("selected");
                    } else {
                        $(this.placeholder).parent().children(".selected").removeClass("selected");
                        $(this.placeholder).addClass("selected");
                    }
                }.bind(this));
                $(this.placeholder).children(".x").click(function () {
                    $(this).parent().remove();
                });
            }
            UserTokenizedElement.prototype.getHtml = function () {
                var html = "<span>";
                html += this.name;
                html += "</span>";
                html += "<span class='x'>";
                html += "</span>";
                html += "<input type='hidden' name='Emails' value='";
                html += this.email;
                html += "'/>";
                return html;
            };
            return UserTokenizedElement;
        })();
        Web.UserTokenizedElement = UserTokenizedElement;        
        var TokenizedUserInputBox = (function () {
            function TokenizedUserInputBox(placeholder, searchAddress, options) {
                this.placeholder = placeholder;
                this.searchAddress = searchAddress;
                this.options = options;
                $(this.placeholder).addClass("input");
                $(this.placeholder).css("width", this.options.width);
                $(this.placeholder).css("padding", "4px 4px");
                this.tokenBox = document.createElement("div");
                $(this.tokenBox).css("font-size", 13);
                $(this.tokenBox).css("line-height", "22px");
                this.searchBox = document.createElement("input");
                $(this.searchBox).attr("type", "text");
                $(this.searchBox).addClass("borderless");
                $(this.searchBox).css("font-size", 13);
                $(this.searchBox).css("padding", "2px 0 2px 0");
                $(this.searchBox).css("margin", "4px");
                $(this.searchBox).focus();
                this.searchBoxResize();
                $(this.tokenBox).append(this.searchBox);
                $(this.placeholder).append(this.tokenBox);
                $(this.searchBox).autocomplete({
                    source: function (request, response) {
                        $.getJSON(this.searchAddress, {
                            q: request.term,
                            type: "jquery"
                        }, response);
                    }.bind(this),
                    select: function (event, ui) {
                        this.addElement(ui.item.label, ui.item.value);
                        return false;
                    }.bind(this),
                    autoFocus: true
                });
                $.ui.autocomplete.prototype._renderItem = function (ul, item) {
                    var listItem = document.createElement("div");
                    var picture = document.createElement("img");
                    $(picture).attr("src", item.picture);
                    $(picture).attr("width", 30);
                    $(picture).attr("height", 30);
                    $(picture).attr("alt", "");
                    $(picture).attr("title", item.label);
                    var pictureBox = $("<div></div>").append(picture);
                    $(pictureBox).css("padding", "2px");
                    $(pictureBox).css("display", "inline-block");
                    $(pictureBox).css("vertical-align", "top");
                    var info = document.createElement("div");
                    $(info).css("line-height", "15px");
                    $(info).css("display", "inline-block");
                    $(info).css("vertical-align", "top");
                    $(info).css("margin-left", 10);
                    $(info).append("<span style=\"font-size:10pt;\">" + item.label + "</span><br/><span style=\"color:#999; font-size:10pt;\">" + item.value + "</span>");
                    $(listItem).append(pictureBox);
                    $(listItem).append(info);
                    return $("<li></li>").data("item.autocomplete", item).append($("<a></a>").append($(listItem))).appendTo(ul);
                }.bind(this);
                $(this.searchBox).keydown(function (event) {
                    if(event.which == 8) {
                        if($(this.searchBox).val() !== "") {
                            $(this.searchBox).val($(this.searchBox).val().substring(0, $(this.searchBox).val().length - 1));
                        } else {
                            if($(this.tokenBox).children(".selected").length == 0) {
                                $(this.searchBox).prev().addClass("selected");
                            } else {
                                $(this.tokenBox).children(".selected").remove();
                            }
                        }
                    } else {
                        if(event.which == 32) {
                            this.matchEmail();
                        }
                    }
                }.bind(this));
                $(document).keydown(function (event) {
                    if(event.which == 8) {
                        if(!this.searchBoxFocus) {
                            $(this.searchBox).focus();
                            $(this.searchBox).trigger(event);
                            $(this.searchBox).blur();
                        }
                        return false;
                    } else {
                        if(event.which == 37) {
                            if(!this.searchBoxFocus) {
                                var child = $(this.tokenBox).children(".selected");
                                $(this.tokenBox).children(".selected").removeClass("selected");
                                if(child.prev(".token").length > 0) {
                                    child.prev(".token").addClass("selected");
                                }
                                return false;
                            } else {
                                $(this.tokenBox).children(".selected").removeClass("selected");
                                $(this.searchBox).prev().addClass("selected");
                                $(this.searchBox).blur();
                                return true;
                            }
                        } else {
                            if(event.which == 39) {
                                if(!this.searchBoxFocus) {
                                    var child = $(this.tokenBox).children(".selected");
                                    $(this.tokenBox).children(".selected").removeClass("selected");
                                    if(child.next(".token").length > 0) {
                                        child.next(".token").addClass("selected");
                                    } else {
                                        $(this.searchBox).focus();
                                    }
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        }
                    }
                }.bind(this));
                $(document).keyup(function (event) {
                    if(event.which == 8) {
                        return false;
                    }
                }.bind(this));
                $(this.searchBox).focus(function () {
                    this.searchBoxFocus = true;
                }.bind(this));
                $(this.searchBox).blur(function () {
                    this.searchBoxFocus = false;
                }.bind(this));
                this.emailRegex = new RegExp("^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$");
            }
            TokenizedUserInputBox.prototype.addToken = function (element) {
                $(this.searchBox).before(element.placeholder);
                $(this.searchBox).val("");
                $(this.searchBox).focus();
                this.searchBoxResize();
            };
            TokenizedUserInputBox.prototype.matchEmail = function () {
                if(this.emailRegex.test($(this.searchBox).val())) {
                    this.addElement($(this.searchBox).val(), $(this.searchBox).val());
                    return false;
                }
            };
            TokenizedUserInputBox.prototype.addElement = function (name, email) {
                this.addToken(new UserTokenizedElement(document.createElement("div"), name, email));
            };
            TokenizedUserInputBox.prototype.removeToken = function () {
                $(this.searchBox).prev().remove();
                this.searchBox.focus();
                this.searchBoxResize();
            };
            TokenizedUserInputBox.prototype.searchBoxResize = function () {
                $(this.searchBox).width(0);
                $(this.searchBox).width($(this.placeholder).width() - $(this.searchBox).position()["left"] - 5);
            };
            return TokenizedUserInputBox;
        })();
        Web.TokenizedUserInputBox = TokenizedUserInputBox;        
        var UserInviteBox = (function () {
            function UserInviteBox(placeholder, submitAddress) {
                this.placeholder = placeholder;
                this.submitAddress = submitAddress;
                $(this.placeholder).hide();
                this.form = document.createElement("form");
                $(this.placeholder).append(this.form);
                $(this.placeholder).css("padding", "5px");
                this.emailInput = document.createElement("div");
                this.inputBox = new TokenizedUserInputBox(this.emailInput, "/Search/UserSearchHandler.ashx", new SizeOption(400, 0));
                this.sendEmails = document.createElement("input");
                $(this.sendEmails).attr("type", "checkbox");
                $(this.sendEmails).attr("checked", "checked");
                $(this.sendEmails).attr("name", "SendEmails");
                this.submitButton = document.createElement("input");
                $(this.submitButton).attr("type", "submit");
                $(this.submitButton).attr("value", "Send Invitations");
                $(this.submitButton).addClass("button-large");
                this.cancelButton = document.createElement("button");
                $(this.cancelButton).text("Cancel");
                $(this.cancelButton).addClass("button-large-gray button-large");
                $(this.cancelButton).click(function () {
                    this.cancel();
                    return false;
                }.bind(this));
                this.resultLabel = document.createElement("div");
                $(this.resultLabel).addClass("round-corner-label-green");
                $(this.resultLabel).width(150);
                $(this.resultLabel).hide();
                $(this.form).attr("action", this.submitAddress);
                $(this.form).attr("method", "POST");
                $(this.form).append("<h4>Invite friends</h4>");
                $(this.form).append(this.emailInput);
                $(this.form).append(this.sendEmails);
                $(this.form).append("Send email notifications.<br/><br/>");
                $(this.form).append(this.submitButton);
                $(this.form).append(this.cancelButton);
                $(this.form).append("<br/>");
                $(this.form).append("<br/>");
                $(this.form).append(this.resultLabel);
                $(this.form).submit(function () {
                    this.inputBox.matchEmail();
                    $(this.form).ajaxSubmit({
                        success: function () {
                            $(this.placeholder).find(".token").remove();
                            this.inputBox.searchBox.focus();
                            $(this.resultLabel).text("Successfully invited");
                            $(this.resultLabel).show("blind", {
                            }, 300, function () {
                                setTimeout(function () {
                                    $(this.resultLabel).hide("blind", {
                                    }, 300);
                                }.bind(this), 1500);
                            }.bind(this));
                        }.bind(this)
                    });
                    return false;
                }.bind(this));
            }
            UserInviteBox.prototype.start = function () {
                $(this.placeholder).show("blind", {
                }, 300);
                this.inputBox.searchBox.focus();
            };
            UserInviteBox.prototype.cancel = function () {
                $(this.placeholder).hide("blind", {
                }, 300);
            };
            return UserInviteBox;
        })();
        Web.UserInviteBox = UserInviteBox;        
    })(Bahen.Web || (Bahen.Web = {}));
    var Web = Bahen.Web;
})(Bahen || (Bahen = {}));
