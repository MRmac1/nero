/**
 * Created by mr_mac1 on 23/12/15.
 */

var stooge = {
    "frist-name" : 'tracy',
    "last-name" : "zhou"
};

if(typeof Object.beget !== 'function')
{
    Object.create = function(o)
    {
        var F = function() {};
        F.prototype = o;
        return new F();
    };
}

var anotherStooge = Object.create(stooge);
stooge.nickName = 'MR_mac1';
anotherStooge.profession = 'hello';

for (var index in anotherStooge)
{
    if(anotherStooge.hasOwnProperty(index))
    {
        //console.log( index + ': '+ anotherStooge[index]);
    }
}

var cal = function()
{
    var count1 = 3;
    var count2 = 3;
    return count1 + count2;
};

for (var index in cal)
{
    console.log(cal[index]);
}