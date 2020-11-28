import os
import json
import requests; from urllib.parse import urlparse
import pandas as pd
from time import sleep

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotInteractableException
from selenium.common.exceptions import StaleElementReferenceException
from bs4 import BeautifulSoup

##############################################################  ############
##################### variable related selenium ##########################
##########################################################################
options = webdriver.ChromeOptions()
options.add_argument('headless')
options.add_argument('lang=ko_KR')
chromedriver_path = "chromedriver"
driver = webdriver.Chrome(os.path.join(os.getcwd(), chromedriver_path), options=options)  # chromedriver 열기

id = 0

def main():
    global driver, load_wb, review_num

    dicts = []
    driver.implicitly_wait(4)  # 렌더링 될때까지 기다린다 4초
    driver.get('https://map.kakao.com/')  # 주소 가져오기

    # 검색할 목록
    place_infos = ['숭실대 맛집']

    for i, place in enumerate(place_infos):
        # delay
        if i % 4 == 0 and i != 0:
            sleep(5)
        print("#####", i)
        dicts = search(place)

    toJson(dicts)
    driver.quit()
    print("finish")


def search(place):
    global driver

    FinalDicts = []
    Dicts = []
    search_area = driver.find_element_by_xpath('//*[@id="search.keyword.query"]')  # 검색 창
    search_area.send_keys(place)  # 검색어 입력
    driver.find_element_by_xpath('//*[@id="search.keyword.submit"]').send_keys(Keys.ENTER)  # Enter로 검색
    sleep(1)

    # 검색된 정보가 있는 경우에만 탐색
    # 1번 페이지 place list 읽기
    html = driver.page_source

    soup = BeautifulSoup(html, 'html.parser')
    place_lists = soup.select('.placelist > .PlaceItem') # 검색된 장소 목록

    # 검색된 첫 페이지 장소 목록 크롤링하기
    Dicts = crawling(place, place_lists)
    FinalDicts.extend(Dicts)
    search_area.clear()

    # 우선 더보기 클릭해서 2페이지
    try:
        driver.find_element_by_xpath('//*[@id="info.search.place.more"]').send_keys(Keys.ENTER)
        sleep(1)

        # 2~ 5페이지 읽기
        for i in range(2, 4):
            # 페이지 넘기기
            xPath = '//*[@id="info.search.page.no' + str(i) + '"]'
            driver.find_element_by_xpath(xPath).send_keys(Keys.ENTER)
            sleep(1)

            html = driver.page_source
            soup = BeautifulSoup(html, 'html.parser')
            place_lists = soup.select('.placelist > .PlaceItem') # 장소 목록 list

            Dicts = crawling(place, place_lists)
            FinalDicts.extend(Dicts)
    except ElementNotInteractableException:
        print('not found')
    finally:
        search_area.clear()

    return FinalDicts


def crawling(place, place_lists):
    """
    페이지 목록을 받아서 크롤링 하는 함수
    :param place: 리뷰 정보 찾을 장소이름
    """
    Dicts = []
    rest_dict = {}
    while_flag = False
    for i, place in enumerate(place_lists):
        if i >= 4:
            i = i + 1
        global id
        id += 1
        place_id = str(id)
        place_name = place.select('.head_item > .tit_name > .link_name')[0].text  # place name
        place_address = place.select('.info_item > .addr > p')[0].text  # place address
        place_menu = place.select('.head_item > span.subcategory')[0].string
        place_Lat = getLatLng(place_address)
        place_menu_det = place_menu
        
        if place_menu == '한식' or place_menu == '도시락' or place_menu == '해물,생선' or place_menu == '국수' or place_menu == '순대' or place_menu == '찌개,전골' or place_menu == '국밥' or place_menu == '한정식' or place_menu == '감자탕' or place_menu == '냉면' or place_menu == '사철탕,영양탕' or place_menu == '죽':
            place_menu = '한식'
        elif place_menu == '해장국' or place_menu == '설렁탕' or place_menu == '곰탕' or place_menu == '두부전문점' or place_menu == '쌈밥' or place_menu == '수제비' or place_menu == '주먹밥':
            place_menu = '한식'
        elif place_menu == '곱창,막창' or place_menu == '족발,보쌈':
            place_menu = '고기'
        elif place_menu == '중식' or place_menu == '중화요리' or place_menu == '양꼬치':
            place_menu = '중식'
        elif place_menu == '일식' or place_menu == '회' or place_menu == '돈까스,우동' or place_menu == '초밥,롤' or place_menu == '참치회' or place_menu == '일식집' or place_menu == '일본식라면' or place_menu == '오니기리':
            place_menu = '일식'
        elif place_menu == '육류,고기':
            place_menu = '고기'        
        elif place_menu == '분식' or place_menu == '떡볶이':
            place_menu = '분식'
        elif place_menu == '술집' or place_menu == '실내포장마차' or place_menu == '일본식주점' or place_menu == '와인바' or place_menu == '칵테일바' or place_menu == '오뎅바':
            place_menu = '술집'
        elif place_menu == '호프,요리주점':
            place_menu = '호프'
        elif place_menu == '패스트푸드' or place_menu == '샌드위치':
            place_menu = '패스트푸드'
        elif place_menu == '카페' or place_menu == '커피전문점' or place_menu == '테마카페' or place_menu == '생과일전문점' or place_menu == '다방' or place_menu == '전통찻집':
            place_menu = '카페'
        elif place_menu == '제과,베이커리' or place_menu == '떡,한과' or place_menu == '아이스크림' or place_menu == '닭강정' or place_menu == '도넛' or place_menu == '토스트' or place_menu == '초콜릿':
            place_menu = '디저트'
        else:
            place_menu = '기타'
        
        print('####', place_name, place_address, place_menu)
        rest_dict = {"id":place_id, "name":place_name, "address":place_address, "type":place_menu, "menu":place_menu_det,"latitude": str(place_Lat[0]), "longitude": str(place_Lat[1]), "img": "이미지", "img_source": "카카오 맵"}
        Dicts.append(rest_dict)
    return Dicts

def toJson(rest_dict):
    with open('json_datas.json', 'w', encoding='utf-8') as file :
        json.dump(rest_dict, file, ensure_ascii=False, indent='\t')

def getLatLng(addr):
  url = 'https://dapi.kakao.com/v2/local/search/address.json?query='+addr
  headers = {"Authorization": "KakaoAK 2b89e4c1f954440a87c3d5adbdac7165"}
  result = json.loads(str(requests.get(url,headers=headers).text))
  match_first = result['documents'][0]['address']

  return [float(match_first['y']),float(match_first['x'])]



if __name__ == "__main__":
    main()
