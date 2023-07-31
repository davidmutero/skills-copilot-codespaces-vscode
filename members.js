function skillsMember() {
    var member = document.getElementById("member").value;
    var skills = document.getElementById("skills").value;
    var memberSkills = document.getElementById("memberSkills");
    var memberSkillsList = document.createElement("li");
    memberSkillsList.innerHTML = member + " : " + skills;
    memberSkills.appendChild(memberSkillsList);
}
