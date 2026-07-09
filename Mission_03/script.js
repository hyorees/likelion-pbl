document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const formSection = document.getElementById('form-section');
    const addForm = document.getElementById('add-form');
    const totalCountSpan = document.getElementById('total-count');
    const summaryGrid = document.getElementById('summary-grid');
    const detailList = document.getElementById('detail-list');
    const apiStatus = document.getElementById('api-status');
    const retryBtn = document.getElementById('retry-btn');
    const filterPart = document.getElementById('filter-part');
    const sortOrder = document.getElementById('sort-order');
    const searchName = document.getElementById('search-name');
    const cancelBtn = document.getElementById('cancel-btn');

    let members = [
        {
            name: "박효연",
            part: "Frontend",
            intro: "안녕하세요",
            email: "hyoyeon036@gmail.com",
            phone: "010-0100-0100",
            website: "alsdjglaksjga.com",
            skills: ["HTML", "CSS", "JS"],
            motto: "화이팅~^^",
            oneLiner: "이건 나"
        }
    ];

    let lastAction = null;

    function render() {
        let filtered = [...members];
        const partValue = filterPart.value;
        const searchValue = searchName.value.toLowerCase();

        if (partValue !== "전체") {
            filtered = filtered.filter(m => m.part === partValue);
        }
        if (searchValue) {
            filtered = filtered.filter(m => m.name.toLowerCase().includes(searchValue));
        }

        if (sortOrder.value === "name") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        summaryGrid.innerHTML = '';
        detailList.innerHTML = '';

        filtered.forEach(m => {
            const card = document.createElement('article');
            card.className = `card-summary ${m.name === "박효연" ? "me" : ""}`;
            card.innerHTML = `
                <div class="image-wrapper">
                    <img src="${m.name === "박효연" ? "/media/girl1.png" : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + m.name}" alt="${m.name}">
                    <span class="badge">${m.skills[0] || 'Tech'}</span>
                </div>
                <div class="card-content">
                    <h3 class="name">${m.name}</h3>
                    <p class="part">${m.part}</p>
                    <p class="one-liner">${m.oneLiner || ''}</p>
                </div>
            `;
            summaryGrid.appendChild(card);

            const detail = document.createElement('article');
            detail.className = 'card-detail';
            detail.innerHTML = `
                <h2 class="detail-name">${m.name}</h2>
                <p class="detail-part">${m.part}</p>
                <div class="detail-section">
                    <h4>자기소개</h4>
                    <p>${m.intro || ''}</p>
                </div>
                <div class="detail-section">
                    <h4>연락처</h4>
                    <ul>
                        <li>Email: ${m.email || ''}</li>
                        <li>Phone: ${m.phone || ''}</li>
                        <li>Website: ${m.website || ''}</li>
                    </ul>
                </div>
                <div class="detail-section">
                    <h4>한 마디</h4>
                    <p>"${m.motto || ''}"</p>
                </div>
            `;
            detailList.appendChild(detail);
        });

        if (filtered.length === 0) {
            summaryGrid.innerHTML = '<p class="count-text">표시할 아기 사자가 없습니다. (필터/검색 조건을 확인해 주세요)</p>';
        }
        totalCountSpan.textContent = members.length;
    }

    async function fetchAPI(count, isRefresh = false) {
        lastAction = () => fetchAPI(count, isRefresh);
        apiStatus.textContent = "불러오는 중...";
        retryBtn.classList.add('hidden');
        const btns = document.querySelectorAll('.control-buttons button');
        btns.forEach(b => b.disabled = true);
        
        try {
            const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            const newOnes = data.results.map(u => ({
                name: `${u.name.first} ${u.name.last}`,
                part: ["Frontend", "Backend", "Design"][Math.floor(Math.random() * 3)],
                intro: "비동기 데이터를 활용해 UI를 구성하는 연습 중입니다.",
                email: u.email,
                phone: u.phone,
                website: `https://example.com/${u.login.username}`,
                skills: ["JavaScript", "React", "HTML/CSS"],
                motto: "데이터가 바뀌면 UI도 바뀐다!",
                oneLiner: `${u.nat} · ${u.location.city}에서 합류했어요!`
            }));

            if (isRefresh) {
                members = [members[0], ...newOnes];
            } else {
                members = [...members, ...newOnes];
            }

            apiStatus.textContent = "준비 완료";
            render();
        } catch (e) {
            apiStatus.textContent = "요청 실패";
            retryBtn.classList.remove('hidden');
        } finally {
            btns.forEach(b => b.disabled = false);
        }
    }

    addBtn.onclick = () => formSection.classList.toggle('hidden');
    deleteBtn.onclick = () => { if(members.length > 1) members.pop(); render(); };
    cancelBtn.onclick = () => { addForm.reset(); formSection.classList.add('hidden'); };

    document.getElementById('add-random-1').onclick = () => fetchAPI(1);
    document.getElementById('add-random-5').onclick = () => fetchAPI(5);
    document.getElementById('refresh-all').onclick = () => fetchAPI(members.length - 1, true);
    retryBtn.onclick = () => lastAction();
    [filterPart, sortOrder, searchName].forEach(el => el.oninput = render);

    document.getElementById('random-fill-btn').onclick = async () => {
        try {
            const res = await fetch('https://randomuser.me/api/?nat=us,gb,ca,au,nz');
            const data = await res.json();
            const u = data.results[0];
            document.getElementById('form-name').value = `${u.name.first} ${u.name.last}`;
            document.getElementById('form-part').value = ["Frontend", "Backend", "Design"][Math.floor(Math.random() * 3)];
            document.getElementById('form-skills').value = "JavaScript, React, HTML/CSS";
            document.getElementById('form-one-liner').value = `${u.nat} · ${u.location.city}에서 합류했어요!`;
            document.getElementById('form-intro').value = "비동기 데이터를 활용해 UI를 구성하는 연습 중입니다.";
            document.getElementById('form-email').value = u.email;
            document.getElementById('form-phone').value = u.phone;
            document.getElementById('form-website').value = `https://example.com/${u.login.username}`;
            document.getElementById('form-motto').value = "데이터가 바뀌면 UI도 바뀐다!";
        } catch (e) {
            alert("랜덤 데이터를 가져오지 못했습니다.");
        }
    };

    addForm.onsubmit = (e) => {
        e.preventDefault();
        const skillsInput = document.getElementById('form-skills').value;
        members.push({
            name: document.getElementById('form-name').value,
            part: document.getElementById('form-part').value,
            intro: document.getElementById('form-intro').value,
            email: document.getElementById('form-email').value,
            phone: document.getElementById('form-phone').value,
            website: document.getElementById('form-website').value,
            motto: document.getElementById('form-motto').value,
            skills: skillsInput ? skillsInput.split(',').map(s => s.trim()) : [],
            oneLiner: document.getElementById('form-one-liner').value
        });
        render();
        addForm.reset();
        formSection.classList.add('hidden');
    };

    render();
});