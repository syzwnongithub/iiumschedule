/*! iiumschedule 2014-08-29 */
$(function(){function a(a){for(var b=[],c=0;a>c;)b.push(""),c+=1;return b}function b(){var a=$("#previewiframe");a.contents().find("html").html(t.render())}function c(){console.log("Saving Style");var a=$("#previewiframe"),b=a.contents().find("html").html();console.log("Posting schedule"),$.post(window.location.origin+"/scheduleformatter/",{data:b,custom:1,no_post_process:1,ctoken:s},function(){console.log("Schedule posted")})}var d=Backbone.Model.extend({render:function(){var a=this.convert_data(this.get("data"));a.style=this.get("style"),a.settings=this.get("settings").attributes;var b=new EJS({text:this.get("template")}).render(a);return b},convert_data:function(b){for(var c=b.studentname,d=b.coursearray,e=8,f=20,g=8,h=0;h<d.length;){for(var i=0,j=d[h];i<j.schedule.length;){var k=j.schedule[i],l=Math.floor(k.start);f>l&&(f=l);var m=Math.floor(k.end);k.end>m&&(m+=1),m>g&&(g=m),i+=1}h+=1}for(var n=12*f,o=14,p=g-f,q=12*p,r={MON:a(o),TUE:a(o),WED:a(o),THUR:a(o),FRI:a(o),SAT:a(o),SUN:a(o)},s={MON:a(p),TUE:a(p),WED:a(p),THUR:a(p),FRI:a(p),SAT:a(p),SUN:a(p)},t={MON:a(q),TUE:a(q),WED:a(q),THUR:a(q),FRI:a(q),SAT:a(q),SUN:a(q)},u=0;u<d.length;){for(var v=d[u],w=0;w<v.schedule.length;){var x=v.schedule[w],l=x.start,m=x.end,y=Math.floor(l),z=l-y;z=Math.round(100*z/5),z+=12*y;var A=Math.floor(m),B=m-A;B=Math.round(100*B/5),B+=12*A;var C=A-y;r[x.day][y-e]={course:v,duration:C,venue:v.schedule[w].venue},s[x.day][y-f]={course:v,duration:C,venue:v.schedule[w].venue};for(var h=1;C>h;)r[x.day][l-e+h]="none",s[x.day][l-f+h]="none",h+=1;var D=B-z;for(t[x.day][z-n]={course:v,duration:D,venue:v.schedule[w].venue},h=1;D>h;)t[x.day][z-n+h]="none",h+=1;w+=1}u+=1}var E={studentname:c,schedule:r,scaledday:s,byfiveminute:t,actualstarthour:f,actualendhour:g,courselist:d,matricnumber:b.matricnumber,ic:b.ic,session:b.session,semester:b.semester,program:b.program};return E}}),e=Backbone.Model.extend({}),f=Backbone.Model.extend({}),g=Backbone.Collection.extend({model:e,url:"themes"}),h=Backbone.View.extend({render:function(){var a=this.data;_.isFunction(a)&&(a=this.data()),this.$el.html(this.template(a)),this.afterRender&&this.afterRender()},data:function(){return this.model},initialize:function(a){this.options=a,this.render()}}),i=h.extend({events:{"click .submit":"submitTheme"},template:_.template($("#submit_theme").html()),afterRender:function(){Recaptcha.create(RECAPTCHA_PUBLIC_KEY,"recaptcha_div",{theme:"red",callback:Recaptcha.focus_response_field})},submitTheme:function(){var a={},b=this;_.each(["name","submitter","email"],function(c){a[c]=b.$el.find("[name="+c+"]").val()}),a.data=JSON.stringify({template:b.model.get("template"),style:b.model.get("style"),settings:_.clone(b.model.get("settings").attributes)}),a.rendered=b.model.render(),a.recaptcha_response_field=Recaptcha.get_response(),a.recaptcha_challenge_field=Recaptcha.get_challenge(),b.$el.find(".loading-mask").css("display","block"),$.post("/themegallery/",a).success(function(){alert("Theme submitted"),Backbone.history.navigate("theme",{trigger:!0,replace:!0}),b.$el.find(".loading-mask").css("display","none")}).fail(function(a){var c=JSON.parse(a.responseText);Recaptcha.reload(),alert("Failed to submit theme. "+c.error),b.$el.find(".loading-mask").css("display","none")})}}),j=h.extend({template:_.template($("#theme_view").html()),initialize:function(a){this.state=a.state},events:{"click .thumbnail":"loadTheme"},loadTheme:function(){var a=this;a.$el.find(".loading-mask").css("display","block"),$.getJSON("/themegallery?name="+this.model.get("name"),function(b){a.$el.find(".loading-mask").css("display","none"),a.state.get("settings").attributes=b.data.settings,a.state.set("style",b.data.style),a.state.set("template",b.data.template)}).fail(function(){a.$el.find(".loading-mask").css("display","none"),alert("error loading theme")})}}),k=h.extend({template:_.template($("#themelist_view").html()),data:function(){return this},initialize:function(){this.collection=new g,this.collection.fetch(),this.listenTo(this.collection,"change",_.bind(this.render,this)),this.listenTo(this.collection,"sync",_.bind(this.render,this)),h.prototype.initialize.call(this)},afterRender:function(){var a=this;this.collection.each(function(b){b.view||(b.view=new j({model:b,state:a.model}));var c=a.$el.find('[data-model="'+b.cid+'"]');b.view.setElement(c).render()})}}),l=h.extend({template:_.template($("#edittemplate_template").html()),events:{"click .save_button":"save"},save:function(){this.$el.find("textarea.content").val();this.model.set("template",this.$el.find("textarea.content").val())}}),m=h.extend({template:_.template($("#editstyle_template").html()),events:{"click .save_button":"save"},save:function(){this.model.set("style",this.$el.find("textarea.content").val())}}),n=h.extend({events:{"click .reset-button":"reset","click .save-button":"save"},template:_.template($("#styler_view").html()),afterRender:function(){var a=window.customizer_styler;a.container=this.$el.find("#mainbody"),a.iframe=this.options.iframe,a.css=this.model.get("style"),this.stylerobj=Styler(a)},reset:function(){this.stylerobj.updateCss(this.model.get("style")),this.model.trigger("change")},save:function(){this.model.set("style",this.stylerobj.getNewCss(!0)),this.model.trigger("change")},remove:function(){this.model.trigger("change"),h.prototype.remove.apply(this)}}),o=h.extend({template:_.template($("#setting_template").html()),afterRender:function(){var a=this;_.each(this.model.get("settings").get("show_day"),function(b,c){a.$el.find('input[type=checkbox][name="show_day.'+c+'"]').prop("checked",b)}),_.each(["showpersonalinfo","showcoursetable","showfulldayname","fixminutealign"],function(b){a.$el.find("input[type=checkbox][name="+b+"]").prop("checked",a.model.get("settings").get(b))}),_.each(a.model.get("settings").get("coursetable"),function(b,c){a.$el.find('input[type=checkbox][name="coursetable.'+c+'"]').prop("checked",b)})},events:{"change [type=checkbox]":"setSetting"},setSetting:function(){var a=this;_.each(a.model.get("settings").get("show_day"),function(b,c){a.model.get("settings").get("show_day")[c]=a.$el.find('input[type=checkbox][name="show_day.'+c+'"]').is(":checked")}),_.each(["showpersonalinfo","showcoursetable","showfulldayname","fixminutealign"],function(b){a.model.get("settings").set(b,a.$el.find("input[type=checkbox][name="+b+"]").is(":checked"))}),_.each(a.model.get("settings").get("coursetable"),function(b,c){a.model.get("settings").get("coursetable")[c]=a.$el.find('input[type=checkbox][name="coursetable.'+c+'"]').is(":checked")}),a.model.trigger("change")}}),p=Backbone.Router.extend({routes:{"":"index",theme:"loadThemes",setting:"loadSettings",styler:"loadStyler",css:"loadCSS",template:"loadTemplateSetting",submit_theme:"loadSubmitTheme"},el:$("#configpane"),loadView:function(a){this.currentView&&this.currentView.remove(),this.currentView=a,this.el.append(this.currentView.$el)},index:function(){this.navigate("theme",{trigger:!0,replace:!0})},loadThemes:function(){this.loadView(new k({model:t}))},loadSettings:function(){this.loadView(new o({model:t}))},loadStyler:function(){this.loadView(new n({model:t,iframe:$("#previewiframe")}))},loadCSS:function(){this.loadView(new m({model:t}))},loadTemplateSetting:function(){this.loadView(new l({model:t}))},loadSubmitTheme:function(){this.loadView(new i({model:t}))}}),q=function(){return Math.random().toString(36).substr(2)},r=function(){return q()+q()},s=r();$("#savebutton a").attr("href","/scheduleloader?ctoken="+s),$("#savebutton a").click(c),$("#tabmenulist td > a").click(function(){var a=$(this).parent();"savebutton"!=a.attr("id")&&($("#tabmenulist td.selected").toggleClass("selected"),a.addClass("selected"))}),window.location.origin||(window.location.origin=window.location.protocol+"//"+window.location.host);var t=new d({template:$("#scheduletemplate").html(),data:window.data,style:"",settings:new f({show_day:{MON:!0,TUE:!0,WED:!0,THUR:!0,FRI:!0,SAT:!0,SUN:!1},fixminutealign:!0,showpersonalinfo:!0,showcoursetable:!0,showfulldayname:!1,coursetable:{code:!0,section:!0,credit:!0,name:!0,lecturer:!0}})});$.when($.get("/static/default.html"),$.get("/static/default.css")).done(function(a,c){t.set("template",a[0]),t.set("style",c[0]),b(),t.on("change",b)}),$(".split-pane").splitPane();new p;Backbone.history.start({})});