import { Component, OnInit } from '@angular/core';
import { TwitterService } from '../twitter.service';
import { trigger,state,style,transition,animate,keyframes,query,stagger } from '@angular/animations';
import { DataService } from "../data.service";
import * as DataMap from 'datamaps';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  providers: [ TwitterService ],
  styleUrls: ['./location.component.css'],
  animations: [
    trigger('trig', [
      transition('* => *', [
        query('#locate_div', style({ opacity: 0}), {optional: true}),

        query('#locate_div', stagger('0ms', [
          animate('1s ease', keyframes([
            style({opacity: 0, transform: 'translateY(75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(-35px)', offset: .6}),
            style({opacity: 1, transform: 'translateY(0)', offset: 1}),
          ]))]), {optional: true})
      ])
    ])
  ]
})

export class LocationComponent implements OnInit {
  tweets = [];
  errorMessage: string;
  searchTag: string;
  oldTag: string; 

  constructor(private twitterService: TwitterService,  private data: DataService){}

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.searchTag = message);
    this.oldTag = this.searchTag;
    let tag = [];

    this.twitterService.getTweets(this.searchTag)
      .subscribe(
        tweets => {
          for (let i=0; i < tweets.length; i++){
              if (tweets[i].location == "") {
                //console.log("skip");
              } else {
                tag.push(tweets[i].location);
            }
          }
           return this.tweets = tag;
         },
         error =>  this.errorMessage = <any>error);
    this.buildMap()
    }

    ngDoCheck() {
      if (this.searchTag !== this.oldTag) {
        console.log(this.tweets);
        this.oldTag = this.searchTag;
        this.update();
      }
    }

    update() {
      this.data.currentMessage.subscribe(message => this.searchTag = message);
      let tag = [];
      this.twitterService.getTweets(this.searchTag)
      .subscribe(
        tweets => {
          for (let i=0; i < tweets.length; i++){
              if (tweets[i].location == "") {
                //console.log("skip");
              } else {
                tag.push(tweets[i].location);
            }
          }
           return this.tweets = tag;
         },
         error =>  this.errorMessage = <any>error);
    }
    buildMap(){
      let map = new DataMap({element: document.getElementById('map_container'),
          scope:"world"})

    }
}