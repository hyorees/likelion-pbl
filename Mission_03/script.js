document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const formSection = document.getElementById('form-section');
    const addForm = document.getElementById('add-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const totalCountSpan = document.getElementById('total-count');
    const summaryGrid = document.getElementById('summary-grid');
    const detailList = document.getElementById('detail-list');

    let members = [
        {
            name: "박효연",
            part: "Frontend",
            intro: "안녕하세요",
            email: "hyoyeon036@gmail.com",
            phone: "010-0100-0100",
            website: "alsdjglaksjga.com",
            skills: ["HTML", "CSS", "JS"],
            motto: "화이팅~^^"
        }
    ];

    function createDetailCard(member) {
        const detailCard = document.createElement('article');
        detailCard.className = 'card-detail';
        detailCard.innerHTML = `
            <h2 class="detail-name">${member.name}</h2>
            <p class="detail-part">${member.part}</p>
            <p class="detail-track">LION TRACK</p>
            
            <div class="detail-content-wrapper">
                <div class="detail-section">
                    <h4>자기소개</h4>
                    <p>${member.intro}</p>
                </div>
                <div class="detail-section">
                    <h4>연락처</h4>
                    <ul>
                        <li>Email: ${member.email}</li>
                        <li>Phone: ${member.phone}</li>
                        <li>Website: <a href="${member.website}" target="_blank">${member.website}</a></li>
                    </ul>
                </div>
                <div class="detail-section">
                    <h4>관심 기술</h4>
                    <ul class="skills-list">
                        ${member.skills.map(skill => `<li>${skill}</li>`).join('')}
                    </ul>
                </div>
                <div class="detail-section">
                    <h4>한 마디</h4>
                    <p class="motto-text">"${member.motto}"</p>
                </div>
            </div>
        `;
        return detailCard;
    }

    function updateCount() {
        totalCountSpan.textContent = members.length;
    }

    function init() {
        const firstMember = members[0];
        detailList.appendChild(createDetailCard(firstMember));
        updateCount();
    }

    addBtn.addEventListener('click', () => {
        formSection.classList.toggle('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        formSection.classList.add('hidden');
        addForm.reset();
    });

    deleteBtn.addEventListener('click', () => {
        if (members.length === 0) return;
        members.pop();
        if (summaryGrid.lastElementChild) {
            summaryGrid.removeChild(summaryGrid.lastElementChild);
        }
        if (detailList.lastElementChild) {
            detailList.removeChild(detailList.lastElementChild);
        }
        updateCount();
    });

    addForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value;
        const part = document.getElementById('form-part').value;
        const skillsInput = document.getElementById('form-skills').value;
        const oneLiner = document.getElementById('form-one-liner').value;
        const intro = document.getElementById('form-intro').value;
        const email = document.getElementById('form-email').value;
        const phone = document.getElementById('form-phone').value;
        const website = document.getElementById('form-website').value;
        const motto = document.getElementById('form-motto').value;

        if (!name || !part) {
            alert("이름과 파트를 입력해주세요!");
            return;
        }

        const skillsArray = skillsInput.split(',').map(s => s.trim());
        const firstSkill = skillsArray[0] || 'Tech';
        const newMember = { name, part, intro, email, phone, website, skills: skillsArray, motto };
        
        members.push(newMember);

        const newSummaryCard = document.createElement('article');
        newSummaryCard.className = 'card-summary';
        newSummaryCard.innerHTML = `
            <div class="image-wrapper">
                <img src="/media/girl1.png" alt="${name}">
                <span class="badge">${firstSkill}</span>
            </div>
            <div class="card-content">
                <h3 class="name">${name}</h3>
                <p class="part">${part}</p>
                <p class="one-liner">${oneLiner}</p>
            </div>
        `;
        summaryGrid.appendChild(newSummaryCard);

        detailList.appendChild(createDetailCard(newMember));

        updateCount();
        addForm.reset();
        formSection.classList.add('hidden');
    });

    init();
});