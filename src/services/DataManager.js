class DataManager {
  semesters = [];
  marks = [];
  top = [];
  topStgroup = [];
  id = null;
  sign = "";
  stgroup = "";
  isSub = false;
  top_notify = false;

  get semesters() {
    return this.semesters;
  }

  get marks() {
    return this.marks;
  }

  get id() {
    return this.marks;
  }

  get top() {
    return this.top;
  }

  get top_notify() {
    return this.top_notify;
  }

  get isSub() {
    return this.isSub;
  }

  get topStgroup() {
    return this.topStgroup;
  }

  get stgroup() {
    return this.stgroup;
  }

  static setSign(sign) {
    this.sign = sign;
  }

  static setTopNotify(top_notify) {
    const bodyParams = { sign: this.sign, top_notify: top_notify };
    const path = `https://ipagar.asuscomm.com:8089/topnotify`;

    return new Promise((resolve, reject) =>
      fetch(path, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyParams)
      })
        .then(response => {
          if (response.status === 200) return response.json();
          else throw new Error(response.status);
        })
        .then(resp => {
          this.top_notify = top_notify;
          resolve(resp);
        })
        .catch(err => reject(err))
    );
  }

  static setNotify(notify) {
    const bodyParams = { sign: this.sign, notify: notify };
    const path = `https://ipagar.asuscomm.com:8089/notify`;

    return new Promise((resolve, reject) =>
      fetch(path, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyParams)
      })
        .then(response => {
          if (response.status === 200) return response.json();
          else throw new Error(response.status);
        })
        .then(resp => {
          this.isSub = !this.isSub;
          resolve(resp);
        })
        .catch(err => reject(err))
    );
  }

  static logout() {
    const bodyParams = { sign: this.sign };
    const path = `https://ipagar.asuscomm.com:8089/delete`;

    return new Promise((resolve, reject) =>
      fetch(path, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyParams)
      })
        .then(response => {
          if (response.status === 200) return response.json();
          else throw new Error(response.status);
        })
        .then(resp => resolve(resp))
        .catch(err => reject(err))
    );
  }

  static register(id, student, password) {
    const bodyParams = {
      sign: this.sign,
      student: student,
      password: password
    };
    const path = `https://ipagar.asuscomm.com:8089/register`;

    return new Promise((resolve, reject) =>
      fetch(path, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyParams)
      })
        .then(response => {
          if (response.status === 200) return response.json();
          else throw new Error(response.status);
        })
        .then(resp => this.auth().then(() => resolve(resp)))
        .catch(err => reject(err))
    );
  }

  static auth() {
    const bodyParams = { sign: this.sign };
    const path = `https://ipagar.asuscomm.com:8089/student`;
    return new Promise((resolve, reject) =>
      fetch(path, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyParams)
      })
        .then(response => {
          if (response.status === 200) return response.json();
          else throw new Error(response.status);
        })
        .then(student => {
          if (student.length) {
            this.id = student[0].id;
            this.stgroup = student[0].stgroup;
            this.isSub = student[0].issubscribed;
            this.top_notify =
              window.location.search.slice(
                window.location.search.indexOf("vk_are_notifications_enabled") +
                  29,
                window.location.search.indexOf("vk_are_notifications_enabled") +
                  30
              ) === "0"
                ? false
                : true;

            if (student[0].top_notify !== this.top_notify)
              return this.setTopNotify(this.top_notify).then(() =>
                this.setSemesters()
              );
            else return this.setSemesters();
          } else throw new Error(student);
        })
        .then(() => this.setTop().then(() => this.setTopStgroup()))
        .then(() => resolve())
        .catch(err => reject(err))
    );
  }

  static setSemesters(student) {
    const bodyParams = { sign: this.sign };
    const path = `https://ipagar.asuscomm.com:8089/semesters`;
    return new Promise((resolve, reject) =>
      fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyParams)
      })
        .then(response => {
          if (response.status === 200) return response.json();
          else throw new Error(response.status);
        })
        .then(json => {
          this.semesters = json.sort((a, b) => {
            if (a.year < b.year) return -1;

            if (a.year > b.year) return 1;

            if (a.year === b.year) if (a.season < b.season) return -1;
            return 0;
          });

          return this.setMarks(student);
        })
        .catch(err => (this.semesters = []))
        .then(semesters => resolve(semesters))
    );
  }

  static setMarks(student) {
    return new Promise((resolve, reject) =>
      Promise.all(
        this.semesters.map((semester, i) => {
          const bodyParams = {
            sign: this.sign,
            year: this.semesters[i].year,
            season: this.semesters[i].season
          };

          const path = `https://ipagar.asuscomm.com:8089/marks`;

          return fetch(path, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyParams)
          })
            .then(response => {
              if (response.status === 200) return response.json();
              else throw new Error(response.status);
            })
            .then(json => {
              let sortMarks = [];

              for (const i in json) {
                const subject = json[i].subject;

                if (!sortMarks.some(sortMark => sortMark.subject === subject)) {
                  const subjectMarks = { subject: subject };

                  json
                    .filter(mark => mark.subject === subject)
                    .forEach(
                      mark => (subjectMarks[`${mark.module}`] = mark.mark)
                    );
                  sortMarks.push(subjectMarks);
                }
              }

              sortMarks.sort(function compare(a, b) {
                if (a.subject < b.subject) {
                  return -1;
                }
                if (a.subject > b.subject) {
                  return 1;
                }
                // a должно быть равным b
                return 0;
              });

              return sortMarks;
            })
            .catch(err => (this.marks = []));
        })
      ).then(marks => {
        this.marks = marks;
        resolve(this.marks);
      })
    );
  }

  static setTop() {
    const path = `https://ipagar.asuscomm.com:8089/top`;
    const bodyParams = {
      sign: this.sign
    };

    return new Promise((resolve, reject) =>
      fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyParams)
      })
        .then(response => {
          if (response.status === 200) return response.json();
          else throw new Error(response.status);
        })
        .then(json => {
          // json = [
          //   { id: 20026727, mark: 48, stgroup: "123" },
          //   { id: 20026728, mark: 35, stgroup: "123" },
          //   { id: 20026729, mark: 35, stgroup: "123" },
          //   { id: 20026725, mark: 25, stgroup: "123" },
          //   { id: 20026723, mark: 25, stgroup: "123" },
          //   { id: 2026722, mark: 25, stgroup: "123" },
          //   { id: 2002672, mark: 25, stgroup: "123" },
          //   { id: 200222, mark: 25, stgroup: "123" },
          //   { id: 202622, mark: 25, stgroup: "123" },
          //   { id: 20072672, mark: 25, stgroup: "123" },
          //   { id: 20024672, mark: 25, stgroup: "123" },
          //   { id: 2002722, mark: 25, stgroup: "123" },
          //   { id: 20026720, mark: 25, stgroup: "123" },
          //   { id: 67602787, mark: 50, stgroup: "123" }
          // ];
          const groups = [];

          for (let element of json) {
            let existingGroups = groups.filter(
              group => group.mark === element.mark
            );
            if (existingGroups.length > 0) {
              existingGroups[0].students.push({
                id: element.id,
                stgroup: element.stgroup
              });
            } else {
              let newGroup = {
                students: [{ id: element.id, stgroup: element.stgroup }],
                mark: element.mark
              };
              groups.push(newGroup);
            }
          }

          this.top = groups.sort((mark1, mark2) => {
            if (mark1.mark > mark2.mark) return -1;
            if (mark1.mark < mark2.mark) return 1;
            return 0;
          });
          resolve(json);
        })
    );
  }

  static setTopStgroup() {
    const path = `https://ipagar.asuscomm.com:8089/topStgroup`;
    const bodyParams = { sign: this.sign };

    return new Promise((resolve, reject) =>
      fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyParams)
      })
        .then(response => {
          if (response.status === 200) return response.json();
          else throw new Error(response.status);
        })
        .then(json => {
          const groups = [];

          for (let element of json) {
            let existingGroups = groups.filter(
              group => group.stgroup.indexOf("Тест") === -1
            ); //убираем тест группы
            filter(group => group.mark === element.mark);
            if (existingGroups.length > 0) {
              existingGroups[0].students.push({
                id: element.id,
                stgroup: element.stgroup
              });
            } else {
              let newGroup = {
                students: [{ id: element.id, stgroup: element.stgroup }],
                mark: element.mark
              };
              groups.push(newGroup);
            }
          }

          this.topStgroup = groups.sort((mark1, mark2) => {
            if (mark1.mark > mark2.mark) return -1;
            if (mark1.mark < mark2.mark) return 1;
            return 0;
          });
          resolve(json);
        })
    );
  }
}

export default DataManager;
