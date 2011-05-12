
(function($) {

    $.fn.addRemoveFields = function(opts) {
        //debug(this);

        // build main options before element iteration
        var options = $.extend({}, $.fn.addRemoveFields.defaults, opts);

        // iterate and reformat each matched element
        return this.each(function() {
            var $this, clonedHtml, container, addButton;
            $this = $(this);
            // build element specific options
            var o = $.meta ? $.extend({}, options, $this.data()) : options;

            if(o.elementToReplicate === ''){
                throw "No element to replicate is specified";
            }
		
            $this = $(this);
            container = this;
            clonedHtml = $(o.elementToReplicate + ':first').clone().wrapAll("<div/>").parent().html(); //A bit hackish to get the outerHtml
            $clonedHtml = $(container.selector + ' ' + o.elementToReplicate);

            addAddButton();
            initialiseExistingClones();
            //End initialise ===

            //Initialises pre-existing elements (this might happen after serverside validation)
            function initialiseExistingClones(){
                $clonedHtml.each(function(index){
                    if(index > 0 && o.keepFirst == true || o.keepFirst == false){
                        addDeleteButton($(this));
                    }
                });
            }

            //Append the cloned html to the container
            function addNewClone(){
                if(_canAddClone()){
                    $this.append(clonedHtml);
                    addDeleteButton($this.children(o.elementToReplicate+':last'));
                }
            }

            function deleteClone($element){
                $element.remove();
                if(_canAddClone()){
                    $(addButton).show();
                }
            }

            //Adds an add button after the container
            function addAddButton(){
                $this.after('<a class="add-element" href="#"><span>'+ o.addText +'</span></a>');

                $(container).next('.add-element').bind('click', function(event){
                    event.preventDefault();
                    if(_canAddClone()){
                        addButton = this;
                        addNewClone($this, clonedHtml);

                        //Now see if we can still add elements, if not, then hide this button
                        if(_canAddClone() == false){
                            $(addButton).hide();
                        }
                    }
                });
            }

            //Adds a delete button after each cloned html container
            function addDeleteButton($element){
                $element.append('<a class="delete-element" href="#"><span>'+ o.deleteText +'</span></a>');

                $element.children('.delete-element').bind('click', function(event){
                    event.preventDefault();
                    deleteClone($element);
                    $(this).remove();
                });
            }

            //Returns the number of replicated elements in the container
            function getNumberOfClones(){
                return $($clonedHtml.selector).length - 1; //use a .selector to make sure the count refreshes
            }

            var _canAddClone = function(){
                var numberOfClones = getNumberOfClones();

                if(o.maximumClones > 0 && numberOfClones < o.maximumClones || o.maximumClones == 0 ){
                    return true;
                }else{
                    return false;
                }
            };


        });
    };

    //
    // private function for debugging
    //
    function debug($obj) {
        if (window.console && window.console.log)
            window.console.log('hilight selection count: ' + $obj.size());
    };



    $.fn.addRemoveFields.defaults = {
        keepFirst: true, //disallows deletion of the first element
        maximumClones: 0, //Maximum number of clones
        elementToReplicate: '', //the selector of the block element to replicate
        addText: 'Add another', //the text on the "add" button
        deleteText: 'Delete' //the text on the "delete" button
    };
//
// end of closure
//
})(jQuery);

