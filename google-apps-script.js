/**
 * 구글 스프레드시트 API 연동을 위한 Google Apps Script 코드입니다.
 * 
 * [설치 방법]
 * 1. 구글 스프레드시트를 새로 만듭니다.
 * 2. 메뉴에서 [확장 프로그램] -> [Apps Script]를 클릭합니다.
 * 3. 기존 코드를 모두 지우고 아래 코드를 복사하여 붙여넣습니다.
 * 4. [배포] -> [새 배포]를 클릭합니다.
 * 5. 유형 선택(톱니바퀴)에서 [웹 앱]을 선택합니다.
 * 6. 설명: "Math Expedition API"
 *    실행 주체: "나"
 *    액세스 권한이 있는 사용자: "모든 사용자" (중요!)
 * 7. [배포] 버튼을 클릭하고 접근 권한을 허용합니다.
 * 8. 생성된 "웹 앱 URL"을 복사하여 프로젝트의 .env 파일에 VITE_GOOGLE_SHEETS_API_URL 값으로 설정합니다.
 */

const SHEET_NAME = 'Users';

function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var nickname = data.nickname;
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Nickname', 'Level', 'Gold', 'Solved_Count', 'Accuracy', 'Wrong_Note']);
      // 헤더 스타일 지정 (선택사항)
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#f3f4f6');
    }
    
    var lastRow = sheet.getLastRow();
    var foundRow = -1;
    
    // 닉네임 검색
    if (lastRow > 1) {
      var nicknames = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (var i = 0; i < nicknames.length; i++) {
        if (nicknames[i][0] === nickname) {
          foundRow = i + 2;
          break;
        }
      }
    }
    
    if (action === 'getUser') {
      if (foundRow > -1) {
        var rowData = sheet.getRange(foundRow, 1, 1, 7).getValues()[0];
        var user = {
          Timestamp: rowData[0],
          Nickname: rowData[1],
          Level: rowData[2],
          Gold: rowData[3],
          Solved_Count: rowData[4],
          Accuracy: rowData[5],
          Wrong_Note: rowData[6]
        };
        output.setContent(JSON.stringify({ success: true, data: user }));
      } else {
        output.setContent(JSON.stringify({ success: true, data: null }));
      }
    } else if (action === 'saveUser') {
      var timestamp = new Date();
      var rowData = [
        timestamp,
        nickname,
        data.level,
        data.gold,
        data.solvedCount,
        data.accuracy,
        data.wrongNote
      ];
      
      if (foundRow > -1) {
        // 기존 사용자 업데이트
        sheet.getRange(foundRow, 1, 1, 7).setValues([rowData]);
      } else {
        // 신규 사용자 추가
        sheet.appendRow(rowData);
      }
      output.setContent(JSON.stringify({ success: true }));
    } else {
      output.setContent(JSON.stringify({ success: false, error: 'Invalid action' }));
    }
    
  } catch (error) {
    output.setContent(JSON.stringify({ success: false, error: error.toString() }));
  }
  
  return output;
}

// GET 요청에 대한 기본 응답 (테스트용)
function doGet(e) {
  return ContentService.createTextOutput("Math Expedition API is running.");
}
